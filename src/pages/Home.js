import React from 'react';
import { motion } from 'framer-motion';
import './Home.css';

const Home = () => {
  const dayData = [
    {
      day: "4th September",
      content: [
        { type: "activity", text: "⏰ Time 6:20 – take cab from VIT to station, train at 7:15 – try to do minimal packing, limit the clothes to a backpack or pack stuff together to reduce luggage." },
        { type: "activity", text: "🎯 Reach Mysore by 12:20 pm." },
        { type: "activity", text: "🍴 Lunch because we would be hungry and stopping at:" },
        { type: "activity", text: "👉 Gufha Cave Restaurant – Cave themed, with vegetarian & non-veg options." },
        { type: "image", src: "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUyMjBwd2k4dDh4NzlsdWV0NHI0NGc5cHg2Z2dnbGpvM2ZreTB6a3NlbyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/daLw3QnTCkDjG/giphy.gif" },
        { type: "cost", amount: 1321 },
        { type: "activity", text: "🚌 Bus stop is 300 meters away, walk time is 2:30. Take the state bus costing 150." },
        { type: "activity", text: "🦌 A 3-hour bus ride through Bandipur Tiger Reserve and Muthanga Wildlife Sanctuary. Keep your cameras ready for wildlife snaps & stories!" },
        { type: "image", src: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUybDdqajRpMzBvM2Njc2RwNzRseDFkeHFmNjU0azB5cHdlbnk5cTFnNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/xT9IgxKsLc9nFM7n32/giphy-downsized.gif" },
        { type: "cost", amount: 1521 },
        { type: "activity", text: "⏰ Time 5:30 – arrive at Sultan Bathery (Bus stop). Take out rental bikes (scooty & bullet). Petrol pump at 4 min distance, fill the tank – cost 500 for 300 km." },
        { type: "cost", amount: 2521 },
        { type: "activity", text: "🏍️ Go to Hosteler, 35 km scenic road trip (~50 mins), time = 7:30 pm" },
        { type: "cost", amount: 4129 },
        { type: "activity", text: "🍽️ Relax and keep the stuff, visit Coffee Grove restaurant for dinner at 2.3 km away." },
        { type: "cost", amount: 4429 },
        { type: "activity", text: "🌃 Come back by 9 pm, chill at hostel → play games, enjoy pool. Next day = mountain climb!" }
      ]
    },
    {
      day: "5th September",
      content: [
        { type: "activity", text: "⏰ Wake up at 5 am, leave hostel by 6." },
        { type: "activity", text: "🏔️ Start ascent to Chembra Peak at 6 am, complete by 10 am (including ~40 min travel, 25 km)." },
        { type: "image", src: "https://media.tenor.com/cd3aK95wYjQAAAAe/absolute-peak.png" },
        { type: "activity", text: "🍳 Breakfast at Boche Toddy Pub Boche 1000 Acre." },
        { type: "cost", amount: 4779 },
        { type: "activity", text: "🛏️ Return, relax, leave for next adventure at 1 pm." },
        { type: "activity", text: "🎢 Adventure park & Vythiri park till 5 pm." },
        { type: "image", src: "https://media.tenor.com/TonA2VZ0QGIAAAAM/zipline-fail-fall.gif" },
        { type: "cost", amount: 5129 },
        { type: "activity", text: "🚣 Evening → Pookode Lake boating." },
        { type: "cost", amount: 5279 },
        { type: "activity", text: "🍲 8 pm → India Gate Restaurant for dinner." },
        { type: "image", src: "https://media4.giphy.com/media/v1.Y2lkPTZjMDliOTUydTdxMHg5aDY5ZWhqOWx1bm5tY2UxM2t3ZDlhd2RjZXhlZXdpN2hrNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/2i06qrSENrXoc/source.gif" },
        { type: "cost", amount: 5579 },
        { type: "activity", text: "🌙 Return to hostel, chill, call it a night." }
      ]
    },
    {
      day: "6th September",
      content: [
        { type: "activity", text: "🚘 Morning drive → Edakkal Caves." },
        { type: "activity", text: "🍴 Lunch near Sultan Bathery at Mathai's Restocafe." },
        { type: "image", src: "https://gifdb.com/images/high/mr-bean-funny-eating-scallops-advtz7298ttfhnap.gif" },
        { type: "cost", amount: 5879 },
        { type: "activity", text: "🌊 Head to Banasura Sagar Dam for sports/adventure → speed boating, kayaking, ATV rides." },
        { type: "image", src: "https://media2.giphy.com/media/v1.Y2lkPTZjMDliOTUybXFqYTdnMXBzbXRreW5ob2VocG4wZzlseDBicTI0d2I0bnJvcXY5aSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/1jaMg5Pjk9t12CTUpV/200.gif" },
        { type: "activity", text: "🌄 Evening → Vythiri farm, Lakkidi Viewpoint, waterfalls (variable costs)." },
        { type: "activity", text: "🍽️ Dinner at 1980's Nostalgic Restaurant." },
        { type: "cost", amount: 6400 },
        { type: "activity", text: "🔥 Final night → bonfire, table tennis." }
      ]
    },
    {
      day: "7th September",
      content: [
        { type: "activity", text: "⏰ Wake at 5 am, visit Phantom Rocks for last ride." },
        { type: "activity", text: "🚌 Go to Sultan Bathery bus stop → back to Mysore." },
        { type: "activity", text: "🍴 Eat near station & catch 2:15 pm Shatabdi → back to VIT." },
        { type: "image", src: "https://media1.tenor.com/m/p_uI2cRfjMoAAAAd/mr-bean-holiday-mister-bean-holiday.gif" },
        { type: "cost", amount: 7771 }
      ]
    }
  ];

  return (
    <div className="page-container">
      <header className="hero-header">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          ⛰️ Way to Wayanad
        </motion.h1>
      </header>

      <main className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <pre className="code-block">
            Static int costPerPerson=0;
          </pre>
        </motion.div>

        {dayData.map((day, index) => (
          <motion.div
            key={day.day}
            className="day-card"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <h2 className="section-title">📅 {day.day}</h2>
            
            {day.content.map((item, itemIndex) => (
              <motion.div
                key={itemIndex}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 + itemIndex * 0.1, duration: 0.5 }}
              >
                {item.type === "activity" && (
                  <p>{item.text}</p>
                )}
                {item.type === "image" && (
                  <motion.img
                    src={item.src}
                    alt={`Day ${index + 1} activity`}
                    className="activity-image"
                    whileHover={{ scale: 1.05 }}
                  />
                )}
                {item.type === "cost" && (
                  <p className="cost">costPerPerson = {item.amount} ₹</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        ))}

        <motion.div
          className="final-message"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <pre className="code-block">
            System.out.println("Welcome To VIT Bitch");
          </pre>
        </motion.div>
      </main>

      <motion.footer
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <h2>✨ Memories waiting to be made! ✨</h2>
        <p>"Chalo behenChode Maze karenge ." 🌏</p>
        <p>Designed by 0017</p>
      </motion.footer>
    </div>
  );
};

export default Home;
