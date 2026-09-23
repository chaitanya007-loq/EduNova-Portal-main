import { useState, useEffect, useRef, useCallback } from 'react';

// Time Period Definition Helper based on System Time
// 🌅 Morning: 5:00 AM – 11:59 AM (5 <= hour < 12)
// ☀️ Noon / Afternoon: 12:00 PM – 4:59 PM (12 <= hour < 17)
// 🌆 Evening: 5:00 PM – 8:59 PM (17 <= hour < 21)
// 🌙 Night: 9:00 PM – 4:59 AM (21 <= hour or hour < 5)

export const getCurrentTimePeriod = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

// Rich Greeting Pools (At least 10 options per period)
export const GREETING_POOLS = {
  morning: [
    {
      title: "Good morning, {name}! ☀️",
      subtitle: "A new sunrise, a thousand possibilities. Let's make today count! 🌅✨"
    },
    {
      title: "Rise and shine, {name}! 🌤️",
      subtitle: "Your next great idea or milestone starts right here today. ✨"
    },
    {
      title: "Ready for a brilliant day, {name}? 🚀",
      subtitle: "Fresh morning energy is perfect for mastering new skills. 💡"
    },
    {
      title: "Good morning, {name}! 👋",
      subtitle: "Every small step you take today brings you closer to your big dreams. 🌟"
    },
    {
      title: "Top of the morning, {name}! ☕",
      subtitle: "Fuel your curiosity and unlock new knowledge today. 🎯"
    },
    {
      title: "Morning focus unlocked, {name}! 🌄",
      subtitle: "Start early, think big, and conquer your learning goals. 🔥"
    },
    {
      title: "Great to see you, {name}! ☀️",
      subtitle: "The morning is yours. Build momentum one session at a time. 💫"
    },
    {
      title: "Good morning, champion {name}! 🏆",
      subtitle: "New day, new achievements waiting for you on EduNova. 📚"
    },
    {
      title: "Early bird status activated, {name}! 🐦",
      subtitle: "Quiet mornings make for the sharpest focus. 💡"
    },
    {
      title: "Welcome back, {name}! 🌅",
      subtitle: "Seize the morning and turn your goals into progress today. ✨"
    }
  ],
  afternoon: [
    {
      title: "Good afternoon, {name}! ☀️",
      subtitle: "The day is still yours. Keep the momentum going! 🚀"
    },
    {
      title: "Half the day is done, {name}! ✨",
      subtitle: "There’s still plenty of time to make today count. 💫"
    },
    {
      title: "Afternoon boost activated, {name}! ⚡",
      subtitle: "Power through your afternoon learning goals with focus. 🎯"
    },
    {
      title: "Good afternoon, {name}! 👋",
      subtitle: "Stay curious, stay consistent—you're doing great! 🌟"
    },
    {
      title: "Keep pushing forward, {name}! 🌤️",
      subtitle: "Great progress happens one afternoon session at a time. 📚"
    },
    {
      title: "Midday momentum check, {name}! 🎯",
      subtitle: "Take a quick breather, then dive back into your goals. 💡"
    },
    {
      title: "Good afternoon, {name}! 🧠",
      subtitle: "Your brain is primed for problem-solving right now. 🚀"
    },
    {
      title: "Afternoon focus mode, {name}! ⏱️",
      subtitle: "Turn afternoon energy into tangible learning milestones. ✨"
    },
    {
      title: "Welcome back, {name}! ☀️",
      subtitle: "Finish the second half of your day stronger than you started. 💪"
    },
    {
      title: "Good afternoon, {name}! 🏆",
      subtitle: "Consistency is your secret weapon. Keep shining! 💫"
    }
  ],
  evening: [
    {
      title: "Good evening, {name}! 🌆",
      subtitle: "Slow down, refocus, and make this evening session count. ✨"
    },
    {
      title: "The day is winding down, {name}. 🌇",
      subtitle: "A little progress tonight can become a big achievement tomorrow. 🚀"
    },
    {
      title: "Evening reflection time, {name}! 💡",
      subtitle: "Review what you learned today and consolidate your growth. 📚"
    },
    {
      title: "Good evening, {name}! 👋",
      subtitle: "End your day on a high note with a quick learning win. 🌟"
    },
    {
      title: "Sunset study session, {name}! 🌆",
      subtitle: "Calm evenings are golden for deep focus and mastery. 🎯"
    },
    {
      title: "Great to see you this evening, {name}! ✨",
      subtitle: "Wrap up your daily goals and celebrate how far you've come. 🏆"
    },
    {
      title: "Evening focus activated, {name}! 🌃",
      subtitle: "Every evening session puts you ahead of the curve. 💫"
    },
    {
      title: "Good evening, {name}! 🛋️",
      subtitle: "Settle in for a comfortable, rewarding study session. ☕"
    },
    {
      title: "Winding down with EduNova, {name}! 📖",
      subtitle: "A steady evening effort compounds into long-term success. 🚀"
    },
    {
      title: "Good evening, scholar {name}! 🌇",
      subtitle: "Finish strong today—tomorrow's success starts tonight. ✨"
    }
  ],
  night: [
    {
      title: "The stars are out, {name}! 🌙",
      subtitle: "The night is quiet, but your dreams are still moving. ✨"
    },
    {
      title: "Night mode activated, {name}! 🌌",
      subtitle: "One more session. One step closer to mastery. 💫"
    },
    {
      title: "Late-night focus, {name}! 🕯️",
      subtitle: "Quiet hours make for deep concentration and breakthrough insights. 💡"
    },
    {
      title: "Greetings, night owl {name}! 🦉",
      subtitle: "While the world sleeps, you are building your future. 🚀"
    },
    {
      title: "Under the moonlight, {name}! 🌙",
      subtitle: "Keep your eyes on the prize, but don't forget to rest soon. 💤"
    },
    {
      title: "Midnight session, {name}! 🌌",
      subtitle: "Your dedication tonight will pay off big tomorrow. 🏆"
    },
    {
      title: "Quiet night, sharp mind, {name}! 🌠",
      subtitle: "Pure focus without distractions—make this count! 🎯"
    },
    {
      title: "Night time wisdom, {name}! ✨",
      subtitle: "Small late-night efforts stack up to extraordinary results. 📚"
    },
    {
      title: "Stargazing & learning, {name}! 🌃",
      subtitle: "Dream big, study focused, and rest easy afterwards. 🌙"
    },
    {
      title: "Late shift learning, {name}! 💫",
      subtitle: "You've got this! Finish this topic and enjoy a restful sleep. 💤"
    }
  ]
};

// Helper: Get ms remaining until next 15-minute boundary (:00, :15, :30, :45)
const getMsUntilNext15MinBoundary = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();

  const next15MinuteMark = (Math.floor(minutes / 15) + 1) * 15;
  const minutesToWait = next15MinuteMark - minutes;
  
  return Math.max(1000, (minutesToWait * 60 * 1000) - (seconds * 1000) - milliseconds);
};

export const useDynamicGreeting = (userName = 'Learner', rotationIntervalMs = 900000) => { // 15 min rotation default (900,000 ms)
  const [greeting, setGreeting] = useState({ title: '', subtitle: '', period: '' });
  const lastIndexRef = useRef(-1);
  const lastPeriodRef = useRef('');

  const formattedName = userName ? userName.split(' ')[0] : 'Learner';

  const pickNextGreeting = useCallback(() => {
    const currentPeriod = getCurrentTimePeriod();
    const pool = GREETING_POOLS[currentPeriod] || GREETING_POOLS.morning;

    let nextIndex;
    if (currentPeriod !== lastPeriodRef.current || pool.length <= 1) {
      // If time period changed, pick a fresh random index for the new time period
      nextIndex = Math.floor(Math.random() * pool.length);
    } else {
      // Pick random index avoiding consecutive duplicate
      do {
        nextIndex = Math.floor(Math.random() * pool.length);
      } while (nextIndex === lastIndexRef.current);
    }

    lastIndexRef.current = nextIndex;
    lastPeriodRef.current = currentPeriod;

    const chosen = pool[nextIndex];
    const titleWithUser = chosen.title.replace('{name}', formattedName);
    const subtitleWithUser = chosen.subtitle.replace('{name}', formattedName);

    setGreeting({
      title: titleWithUser,
      subtitle: subtitleWithUser,
      period: currentPeriod
    });
  }, [formattedName]);

  useEffect(() => {
    // 1. Pick initial greeting immediately based on exact system time
    pickNextGreeting();

    let intervalTimer = null;
    let boundaryTimeout = null;

    // 2. Schedule rotation aligned to 15-minute system clock boundaries (:00, :15, :30, :45)
    const msToBoundary = getMsUntilNext15MinBoundary();

    boundaryTimeout = setTimeout(() => {
      pickNextGreeting();

      // Set recurring 15-minute interval
      intervalTimer = setInterval(() => {
        pickNextGreeting();
      }, rotationIntervalMs);
    }, msToBoundary);

    // 3. Recalculate immediately when user switches back to dashboard or tab gets focus
    const handleVisibilityOrFocus = () => {
      if (!document.hidden) {
        pickNextGreeting();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      if (boundaryTimeout) clearTimeout(boundaryTimeout);
      if (intervalTimer) clearInterval(intervalTimer);
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [pickNextGreeting, rotationIntervalMs]);

  return greeting;
};
