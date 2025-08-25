import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getExpenses = query({
  args: {},
  handler: async (ctx: any) => {
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
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("expenses", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deleteExpense = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});

// Payment tracking functions
export const getPayments = query({
  args: {},
  handler: async (ctx: any) => {
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
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("payments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deletePayment = mutation({
  args: { id: v.id("payments") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});

// Calculate balances for each person
export const getBalances = query({
  args: {},
  handler: async (ctx: any) => {
    const expenses = await ctx.db.query("expenses").collect();
    const payments = await ctx.db.query("payments").collect();
    
    // Initialize balances
    const balances: any = {};
    const allPeople = new Set<string>();
    
    // Collect all people from expenses
    expenses.forEach((expense: any) => {
      allPeople.add(expense.paidBy);
      expense.splitBetween.forEach((person: string) => allPeople.add(person));
    });
    
    // Initialize balances to 0
    Array.from(allPeople).forEach((person: string) => {
      balances[person] = 0;
    });
    
    // Calculate expense balances
    expenses.forEach((expense: any) => {
      const splitAmount = expense.amount / expense.splitBetween.length;
      
      // Person who paid gets credited the full amount
      balances[expense.paidBy] += expense.amount;
      
      // People who owe get debited their share
      expense.splitBetween.forEach((person: string) => {
        balances[person] -= splitAmount;
      });
    });
    
    // Apply payments
    payments.forEach((payment: any) => {
      balances[payment.from] -= payment.amount;
      balances[payment.to] += payment.amount;
    });
    
    return balances;
  },
});

// Get detailed breakdown for a specific person
export const getPersonBreakdown = query({
  args: { personName: v.string() },
  handler: async (ctx: any, args: any) => {
    const expenses = await ctx.db.query("expenses").collect();
    const payments = await ctx.db.query("payments").collect();
    
    const breakdown: any = {
      owesTo: {}, // Who this person owes money to
      owedBy: {}, // Who owes money to this person
      totalOwed: 0,
      totalOwedTo: 0
    };
    
    // Calculate from expenses
    expenses.forEach((expense: any) => {
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
        expense.splitBetween.forEach((person: string) => {
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
    payments.forEach((payment: any) => {
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
    Object.keys(breakdown.owesTo).forEach((person: string) => {
      if (breakdown.owesTo[person] <= 0) {
        delete breakdown.owesTo[person];
      }
    });
    
    Object.keys(breakdown.owedBy).forEach((person: string) => {
      if (breakdown.owedBy[person] <= 0) {
        delete breakdown.owedBy[person];
      }
    });
    
    return breakdown;
  },
});
