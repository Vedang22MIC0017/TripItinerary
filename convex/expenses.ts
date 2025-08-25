import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getExpenses = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("expenses").order("desc").collect();
  },
});

export const addExpense = mutation({
  args: {
    title: v.string(),
    amount: v.number(),
    paidBy: v.string(),
    splitBetween: v.array(v.string()),
    category: v.string(),
    description: v.optional(v.string()),
    billImage: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("expenses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Payment tracking functions
export const getPayments = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("payments").order("desc").collect();
  },
});

export const addPayment = mutation({
  args: {
    from: v.string(),
    to: v.string(),
    amount: v.number(),
    description: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deletePayment = mutation({
  args: { id: v.id("payments") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Calculate balances for each person
export const getBalances = query({
  args: {},
  handler: async (ctx) => {
    const expenses = await ctx.db.query("expenses").collect();
    const payments = await ctx.db.query("payments").collect();
    
    // Initialize balances
    const balances = {};
    const allPeople = new Set();
    
    // Collect all people from expenses
    expenses.forEach(expense => {
      allPeople.add(expense.paidBy);
      expense.splitBetween.forEach(person => allPeople.add(person));
    });
    
    // Initialize balances to 0
    allPeople.forEach(person => {
      balances[person] = 0;
    });
    
    // Calculate expense balances
    expenses.forEach(expense => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      
      // Person who paid gets credited the full amount
      balances[expense.paidBy] += expense.amount;
      
      // People who owe get debited their share
      expense.splitBetween.forEach(person => {
        balances[person] -= splitAmount;
      });
    });
    
    // Apply payments
    payments.forEach(payment => {
      balances[payment.from] -= payment.amount;
      balances[payment.to] += payment.amount;
    });
    
    return balances;
  },
});

// Get detailed breakdown for a specific person
export const getPersonBreakdown = query({
  args: { personName: v.string() },
  handler: async (ctx, args) => {
    const expenses = await ctx.db.query("expenses").collect();
    const payments = await ctx.db.query("payments").collect();
    
    const breakdown = {
      owesTo: {}, // Who this person owes money to
      owedBy: {}, // Who owes money to this person
      totalOwed: 0,
      totalOwedTo: 0
    };
    
    // Calculate from expenses
    expenses.forEach(expense => {
      if (expense.splitBetween.includes(args.personName)) {
        const splitAmount = expense.amount / expense.splitBetween.length;
        
        if (expense.paidBy !== args.personName) {
          // This person owes money to the person who paid
          if (!breakdown.owesTo[expense.paidBy]) {
            breakdown.owesTo[expense.paidBy] = 0;
          }
          breakdown.owesTo[expense.paidBy] += splitAmount;
          breakdown.totalOwed += splitAmount;
        }
      } else if (expense.paidBy === args.personName) {
        // This person paid for others
        expense.splitBetween.forEach(person => {
          if (person !== args.personName) {
            const splitAmount = expense.amount / expense.splitBetween.length;
            if (!breakdown.owedBy[person]) {
              breakdown.owedBy[person] = 0;
            }
            breakdown.owedBy[person] += splitAmount;
            breakdown.totalOwedTo += splitAmount;
          }
        });
      }
    });
    
    // Apply payments
    payments.forEach(payment => {
      if (payment.from === args.personName) {
        // This person made a payment to someone
        if (!breakdown.owesTo[payment.to]) {
          breakdown.owesTo[payment.to] = 0;
        }
        breakdown.owesTo[payment.to] -= payment.amount;
        breakdown.totalOwed -= payment.amount;
      } else if (payment.to === args.personName) {
        // Someone made a payment to this person
        if (!breakdown.owedBy[payment.from]) {
          breakdown.owedBy[payment.from] = 0;
        }
        breakdown.owedBy[payment.from] -= payment.amount;
        breakdown.totalOwedTo -= payment.amount;
      }
    });
    
    // Remove zero or negative amounts
    Object.keys(breakdown.owesTo).forEach(person => {
      if (breakdown.owesTo[person] <= 0) {
        delete breakdown.owesTo[person];
      }
    });
    
    Object.keys(breakdown.owedBy).forEach(person => {
      if (breakdown.owedBy[person] <= 0) {
        delete breakdown.owedBy[person];
      }
    });
    
    return breakdown;
  },
});
