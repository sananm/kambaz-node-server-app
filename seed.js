import "dotenv/config";
import mongoose from "mongoose";
import UserModel from "./Kambaz/Users/model.js";
import CourseModel from "./Kambaz/Courses/model.js";
import ModuleModel from "./Kambaz/Modules/model.js";
import AssignmentModel from "./Kambaz/Assignments/model.js";
import EnrollmentModel from "./Kambaz/Enrollments/model.js";

const CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

// Seed data
const users = [
  {
    _id: "123",
    username: "iron_man",
    password: "stark123",
    firstName: "Tony",
    lastName: "Stark",
    email: "tony@stark.com",
    dob: "1970-05-29",
    role: "STUDENT",
    loginId: "001234561S",
    section: "S101",
    lastActivity: "2020-10-01",
    totalActivity: "10:21:32",
  },
  {
    _id: "690",
    username: "capt_america",
    password: "rogers123",
    firstName: "Steve",
    lastName: "Rogers",
    email: "steve@avengers.com",
    dob: "1918-07-04",
    role: "FACULTY",
    loginId: "001234563F",
    section: "S101",
    lastActivity: "2020-11-03",
    totalActivity: "12:40:15",
  },
  {
    _id: "234",
    username: "dark_knight",
    password: "wayne123",
    firstName: "Bruce",
    lastName: "Wayne",
    email: "bruce@wayne.com",
    dob: "1972-02-19",
    role: "STUDENT",
    loginId: "001234562S",
    section: "S101",
    lastActivity: "2020-11-02",
    totalActivity: "15:32:43",
  },
  {
    _id: "345",
    username: "caped_crusader",
    password: "kent123",
    firstName: "Clark",
    lastName: "Kent",
    email: "clark@kent.com",
    dob: "1975-06-18",
    role: "STUDENT",
    loginId: "001234563S",
    section: "S101",
    lastActivity: "2020-11-03",
    totalActivity: "20:10:55",
  },
  {
    _id: "456",
    username: "amazon_warrior",
    password: "prince123",
    firstName: "Diana",
    lastName: "Prince",
    email: "diana@amazon.com",
    dob: "1976-03-17",
    role: "STUDENT",
    loginId: "001234564S",
    section: "S101",
    lastActivity: "2020-11-04",
    totalActivity: "18:43:21",
  },
  {
    _id: "567",
    username: "flash",
    password: "allen123",
    firstName: "Barry",
    lastName: "Allen",
    email: "barry@flash.com",
    dob: "1985-09-30",
    role: "STUDENT",
    loginId: "001234565S",
    section: "S101",
    lastActivity: "2020-11-05",
    totalActivity: "5:15:10",
  },
  {
    _id: "678",
    username: "aqua_man",
    password: "curry123",
    firstName: "Arthur",
    lastName: "Curry",
    email: "arthur@sea.com",
    dob: "1983-11-15",
    role: "TA",
    loginId: "001234566T",
    section: "S101",
    lastActivity: "2020-11-06",
    totalActivity: "12:30:00",
  },
  {
    _id: "789",
    username: "hawkeye",
    password: "barton123",
    firstName: "Clint",
    lastName: "Barton",
    email: "clint@avengers.com",
    dob: "1975-01-07",
    role: "STUDENT",
    loginId: "001234567S",
    section: "S102",
    lastActivity: "2020-11-07",
    totalActivity: "8:45:30",
  },
  {
    _id: "890",
    username: "black_widow",
    password: "romanoff123",
    firstName: "Natasha",
    lastName: "Romanoff",
    email: "natasha@avengers.com",
    dob: "1984-11-22",
    role: "STUDENT",
    loginId: "001234568S",
    section: "S102",
    lastActivity: "2020-11-08",
    totalActivity: "14:20:45",
  },
  {
    _id: "901",
    username: "hulk",
    password: "banner123",
    firstName: "Bruce",
    lastName: "Banner",
    email: "bruce@avengers.com",
    dob: "1969-12-18",
    role: "FACULTY",
    loginId: "001234569F",
    section: "S101",
    lastActivity: "2020-11-09",
    totalActivity: "25:45:30",
  },
  {
    _id: "902",
    username: "thor_odinson",
    password: "mjolnir123",
    firstName: "Thor",
    lastName: "Odinson",
    email: "thor@asgard.com",
    dob: "1982-05-25",
    role: "FACULTY",
    loginId: "001234570F",
    section: "S102",
    lastActivity: "2020-11-10",
    totalActivity: "30:15:20",
  },
  {
    _id: "1000",
    username: "sanan",
    password: "sanan",
    firstName: "Sanan",
    lastName: "Moinuddin",
    email: "sanan@kambaz.com",
    dob: "2000-01-01",
    role: "ADMIN",
    loginId: "001234571A",
    section: "S000",
    lastActivity: "2025-11-12",
    totalActivity: "100:00:00",
  },
];

const courses = [
  {
    _id: "RS101",
    name: "Rocket Propulsion",
    number: "RS4550",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D123",
    credits: 4,
    description:
      "This course provides an in-depth study of the fundamentals of rocket propulsion, covering topics such as propulsion theory, engine types, fuel chemistry, and the practical applications of rocket technology. Designed for students with a strong background in physics and engineering, the course includes both theoretical instruction and hands-on laboratory work",
  },
  {
    _id: "RS102",
    name: "Aerodynamics",
    number: "RS4560",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D123",
    credits: 3,
    description:
      "This course offers a comprehensive exploration of aerodynamics, focusing on the principles and applications of airflow and its effects on flying objects. Topics include fluid dynamics, airfoil design, lift and drag forces, and the aerodynamic considerations in aircraft design. The course blends theoretical learning with practical applications, suitable for students pursuing a career in aeronautics or astronautics engineering.",
  },
  {
    _id: "RS103",
    name: "Spacecraft Design",
    number: "RS4570",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D123",
    credits: 4,
    description:
      "This course delves into the principles and practices of spacecraft design, offering students a detailed understanding of the engineering and technology behind spacecraft systems. Key topics include spacecraft structure, propulsion, power systems, thermal control, and payload integration. Emphasizing both theoretical concepts and practical skills, the course prepares students for careers in the space industry, with a focus on innovative design and problem-solving in the context of current and future space missions",
  },
  {
    _id: "RS104",
    name: "Organic Chemistry",
    number: "CH1230",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D134",
    credits: 3,
    description:
      "Organic Chemistry is an in-depth course that explores the structure, properties, composition, and reactions of organic compounds and materials. The course covers various topics including hydrocarbons, functional groups, stereochemistry, and organic synthesis techniques. Students will learn about the mechanisms of organic reactions, spectroscopic methods for structure determination, and the role of organic chemistry in biological systems. Emphasis is placed on problem-solving and laboratory skills, preparing students for advanced studies in chemistry, medicine, and related fields.",
  },
  {
    _id: "RS105",
    name: "Inorganic Chemistry",
    number: "CH1240",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D134",
    credits: 3,
    description:
      "Inorganic Chemistry focuses on the properties, structures, and behaviors of inorganic and organometallic compounds. This course covers a range of topics including coordination chemistry, metal complexes, bonding theories, symmetry, and crystal field theory. Students will also explore the role of inorganic chemistry in real-world applications such as catalysis, materials science, and bioinorganic processes. Laboratory work emphasizes synthesis and analysis of inorganic compounds, fostering a deeper understanding of theoretical concepts.",
  },
  {
    _id: "RS106",
    name: "Physical Chemistry",
    number: "CH1250",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "D134",
    credits: 3,
    description:
      "Physical Chemistry merges the principles of physics and chemistry to understand the physical properties of molecules, the forces that act upon them, and the chemical reactions they undergo. Key topics include thermodynamics, kinetics, quantum mechanics, and spectroscopy. The course provides a comprehensive understanding of molecular behavior, reaction dynamics, and the application of mathematical methods in solving chemical problems. Labs focus on experimental techniques and data analysis, equipping students with skills necessary for research and advanced study in chemistry and related fields.",
  },
  {
    _id: "RS107",
    name: "Ancient Languages and Scripts of Middle-earth",
    number: "ME101",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "Languages",
    credits: 3,
    description:
      "This course offers an exploration of the ancient languages and scripts found throughout Middle-earth, including Elvish (Sindarin and Quenya), Dwarvish (Khuzdul), and the Black Speech of Mordor. Students will learn the historical and cultural contexts of these languages, their linguistic structures, and their usage in various inscriptions and texts. Emphasis is on understanding the philological aspects and the role of language in shaping Middle-earth's history and lore.",
  },
  {
    _id: "RS108",
    name: "Wizards, Elves, and Men: Inter-species Diplomacy in Middle-earth",
    number: "ME102",
    startDate: "2023-01-10",
    endDate: "2023-05-15",
    department: "Political Studies",
    credits: 4,
    description:
      "This course explores the complex relationships and diplomatic interactions among the different races of Middle-earth: Elves, Men, Dwarves, and Wizards. Topics include the study of historical alliances, conflicts, and the role of leadership and wisdom in maintaining peace. Students will engage in discussions and case studies on key events in Middle-earth's history, such as the Council of Elrond and the War of the Ring, to understand the principles of diplomacy and conflict resolution in a multi-species context.",
  },
];

const modules = [
  {
    _id: "M101",
    name: "Introduction to Rocket Propulsion",
    description: "Basic principles of rocket propulsion and rocket engines.",
    course: "RS101",
    lessons: [
      {
        _id: "L101",
        name: "History of Rocketry",
        description: "A brief history of rocketry and space exploration.",
        module: "M101",
      },
      {
        _id: "L102",
        name: "Rocket Propulsion Fundamentals",
        description: "Basic principles of rocket propulsion.",
        module: "M101",
      },
      {
        _id: "L103",
        name: "Rocket Engine Types",
        description: "Overview of different rocket engine types.",
        module: "M101",
      },
    ],
  },
  {
    _id: "M102",
    name: "Fuel and Combustion",
    description:
      "Understanding rocket fuel, combustion processes, and efficiency.",
    course: "RS101",
    lessons: [
      {
        _id: "L201",
        name: "Rocket Fuel",
        description: "Overview of different types of rocket fuels.",
        module: "M102",
      },
      {
        _id: "L202",
        name: "Combustion Processes",
        description: "Understanding combustion processes and efficiency.",
        module: "M102",
      },
      {
        _id: "L203",
        name: "Combustion Instability",
        description: "Understanding combustion instability and mitigation.",
        module: "M102",
      },
    ],
  },
  {
    _id: "M103",
    name: "Nozzle Design",
    description:
      "Principles of rocket nozzle design and performance optimization.",
    course: "RS101",
    lessons: [
      {
        _id: "L301",
        name: "Nozzle Design",
        description: "Overview of different types of rocket nozzles.",
        module: "M103",
      },
      {
        _id: "L302",
        name: "Nozzle Performance",
        description: "Understanding nozzle performance and efficiency.",
        module: "M103",
      },
      {
        _id: "L303",
        name: "Nozzle Optimization",
        description: "Optimizing nozzle design for specific applications.",
        module: "M103",
      },
    ],
  },
  {
    _id: "M201",
    name: "Fundamentals of Aerodynamics",
    description: "Basic aerodynamic concepts and fluid dynamics principles.",
    course: "RS102",
    lessons: [
      {
        _id: "L401",
        name: "Introduction to Aerodynamics",
        description: "Overview of aerodynamics and its applications.",
        module: "M201",
      },
      {
        _id: "L402",
        name: "Fluid Dynamics",
        description: "Understanding fluid dynamics principles.",
        module: "M201",
      },
      {
        _id: "L403",
        name: "Airfoil Design",
        description: "Principles of airfoil design and performance.",
        module: "M201",
      },
    ],
  },
  {
    _id: "M202",
    name: "Subsonic and Supersonic Flow",
    description: "Understanding subsonic and supersonic aerodynamic behaviors.",
    course: "RS102",
    lessons: [
      {
        _id: "L501",
        name: "Subsonic Flow",
        description: "Understanding subsonic aerodynamic behaviors.",
        module: "M202",
      },
      {
        _id: "L502",
        name: "Supersonic Flow",
        description: "Understanding supersonic aerodynamic behaviors.",
        module: "M202",
      },
      {
        _id: "L503",
        name: "Shock Waves",
        description: "Understanding shock waves and their effects.",
        module: "M202",
      },
    ],
  },
  {
    _id: "M203",
    name: "Aerodynamic Heating",
    description: "Study of aerodynamic heating and thermal protection systems.",
    course: "RS102",
    lessons: [
      {
        _id: "L601",
        name: "Aerodynamic Heating",
        description: "Understanding aerodynamic heating principles.",
        module: "M203",
      },
      {
        _id: "L602",
        name: "Thermal Protection Systems",
        description: "Overview of thermal protection systems.",
        module: "M203",
      },
      {
        _id: "L603",
        name: "Heat Transfer",
        description: "Understanding heat transfer mechanisms.",
        module: "M203",
      },
    ],
  },
  {
    _id: "M301",
    name: "Spacecraft Structural Design",
    description:
      "Fundamentals of designing spacecraft structures and materials selection.",
    course: "RS103",
    lessons: [
      {
        _id: "L701",
        name: "Structural Design Principles",
        description: "Overview of spacecraft structural design.",
        module: "M301",
      },
      {
        _id: "L702",
        name: "Materials Selection",
        description: "Selecting appropriate materials for spacecraft.",
        module: "M301",
      },
      {
        _id: "L703",
        name: "Stress Analysis",
        description: "Understanding stress analysis in spacecraft structures.",
        module: "M301",
      },
    ],
  },
  {
    _id: "M302",
    name: "Orbital Mechanics",
    description: "Understanding orbital dynamics and mission planning.",
    course: "RS103",
    lessons: [
      {
        _id: "L801",
        name: "Orbital Dynamics",
        description: "Understanding orbital dynamics principles.",
        module: "M302",
      },
      {
        _id: "L802",
        name: "Mission Planning",
        description: "Planning spacecraft missions and trajectories.",
        module: "M302",
      },
      {
        _id: "L803",
        name: "Orbital Maneuvers",
        description: "Understanding orbital maneuvers and transfers.",
        module: "M302",
      },
    ],
  },
  {
    _id: "M303",
    name: "Spacecraft Systems Engineering",
    description: "Overview of spacecraft systems and subsystems engineering.",
    course: "RS103",
    lessons: [
      {
        _id: "L901",
        name: "Systems Engineering",
        description: "Overview of spacecraft systems engineering.",
        module: "M303",
      },
      {
        _id: "L902",
        name: "Subsystems Integration",
        description: "Integrating spacecraft subsystems.",
        module: "M303",
      },
      {
        _id: "L903",
        name: "Testing and Validation",
        description: "Testing and validating spacecraft systems.",
        module: "M303",
      },
    ],
  },
];

const assignments = [
  {
    _id: "A101",
    title: "Propulsion Assignment",
    course: "RS101",
    description: "Design a rocket propulsion system for a small satellite.",
    points: 100,
    dueDate: "2024-05-13",
    availableFrom: "2024-05-06",
    availableUntil: "2024-05-20",
  },
  {
    _id: "A102",
    title: "Combustion Analysis",
    course: "RS101",
    description: "Analyze the combustion efficiency of a given rocket fuel.",
    points: 100,
    dueDate: "2024-05-20",
    availableFrom: "2024-05-13",
    availableUntil: "2024-05-27",
  },
  {
    _id: "A103",
    title: "Nozzle Design Project",
    course: "RS101",
    description: "Design and optimize a rocket nozzle for maximum efficiency.",
    points: 100,
    dueDate: "2024-05-27",
    availableFrom: "2024-05-20",
    availableUntil: "2024-06-03",
  },
  {
    _id: "A201",
    title: "Aerodynamics Quiz",
    course: "RS102",
    description: "Complete the aerodynamics fundamentals quiz.",
    points: 100,
    dueDate: "2024-05-13",
    availableFrom: "2024-05-06",
    availableUntil: "2024-05-20",
  },
  {
    _id: "A202",
    title: "Flow Analysis",
    course: "RS102",
    description: "Analyze subsonic and supersonic flow patterns.",
    points: 100,
    dueDate: "2024-05-20",
    availableFrom: "2024-05-13",
    availableUntil: "2024-05-27",
  },
  {
    _id: "A203",
    title: "Heating Analysis",
    course: "RS102",
    description: "Calculate aerodynamic heating for a reentry vehicle.",
    points: 100,
    dueDate: "2024-05-27",
    availableFrom: "2024-05-20",
    availableUntil: "2024-06-03",
  },
  {
    _id: "A301",
    title: "Structural Design Task",
    course: "RS103",
    description: "Design a structural system for a spacecraft.",
    points: 100,
    dueDate: "2024-05-13",
    availableFrom: "2024-05-06",
    availableUntil: "2024-05-20",
  },
  {
    _id: "A302",
    title: "Orbital Calculations",
    course: "RS103",
    description: "Perform orbital mechanics calculations for a mission.",
    points: 100,
    dueDate: "2024-05-20",
    availableFrom: "2024-05-13",
    availableUntil: "2024-05-27",
  },
  {
    _id: "A303",
    title: "Systems Engineering Exam",
    course: "RS103",
    description: "Complete the spacecraft systems engineering exam.",
    points: 100,
    dueDate: "2024-05-27",
    availableFrom: "2024-05-20",
    availableUntil: "2024-06-03",
  },
];

const enrollments = [
  // Student enrollments
  { _id: "1", user: "123", course: "RS101" },
  { _id: "2", user: "234", course: "RS101" },
  { _id: "3", user: "345", course: "RS101" },
  { _id: "4", user: "456", course: "RS101" },
  { _id: "5", user: "567", course: "RS101" },
  { _id: "6", user: "678", course: "RS101" },
  { _id: "8", user: "234", course: "RS102" },
  { _id: "9", user: "789", course: "RS102" },
  { _id: "10", user: "890", course: "RS102" },
  { _id: "11", user: "123", course: "RS102" },
  { _id: "13", user: "345", course: "RS103" },
  { _id: "14", user: "456", course: "RS103" },
  { _id: "15", user: "567", course: "RS103" },

  // Faculty 690 (capt_america) - all courses
  { _id: "100", user: "690", course: "RS101" },
  { _id: "101", user: "690", course: "RS102" },
  { _id: "102", user: "690", course: "RS103" },
  { _id: "103", user: "690", course: "RS104" },
  { _id: "104", user: "690", course: "RS105" },
  { _id: "105", user: "690", course: "RS106" },
  { _id: "106", user: "690", course: "RS107" },
  { _id: "107", user: "690", course: "RS108" },

  // Faculty 901 (hulk) - all courses
  { _id: "110", user: "901", course: "RS101" },
  { _id: "111", user: "901", course: "RS102" },
  { _id: "112", user: "901", course: "RS103" },
  { _id: "113", user: "901", course: "RS104" },
  { _id: "114", user: "901", course: "RS105" },
  { _id: "115", user: "901", course: "RS106" },
  { _id: "116", user: "901", course: "RS107" },
  { _id: "117", user: "901", course: "RS108" },

  // Faculty 902 (thor_odinson) - all courses
  { _id: "120", user: "902", course: "RS101" },
  { _id: "121", user: "902", course: "RS102" },
  { _id: "122", user: "902", course: "RS103" },
  { _id: "123", user: "902", course: "RS104" },
  { _id: "124", user: "902", course: "RS105" },
  { _id: "125", user: "902", course: "RS106" },
  { _id: "126", user: "902", course: "RS107" },
  { _id: "127", user: "902", course: "RS108" },

  // Admin 1000 (sanan) - all courses
  { _id: "130", user: "1000", course: "RS101" },
  { _id: "131", user: "1000", course: "RS102" },
  { _id: "132", user: "1000", course: "RS103" },
  { _id: "133", user: "1000", course: "RS104" },
  { _id: "134", user: "1000", course: "RS105" },
  { _id: "135", user: "1000", course: "RS106" },
  { _id: "136", user: "1000", course: "RS107" },
  { _id: "137", user: "1000", course: "RS108" },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await UserModel.deleteMany({});
    await CourseModel.deleteMany({});
    await ModuleModel.deleteMany({});
    await AssignmentModel.deleteMany({});
    await EnrollmentModel.deleteMany({});

    // Insert seed data
    console.log("Inserting users...");
    await UserModel.insertMany(users);
    console.log(`Inserted ${users.length} users`);

    console.log("Inserting courses...");
    await CourseModel.insertMany(courses);
    console.log(`Inserted ${courses.length} courses`);

    console.log("Inserting modules...");
    await ModuleModel.insertMany(modules);
    console.log(`Inserted ${modules.length} modules`);

    console.log("Inserting assignments...");
    await AssignmentModel.insertMany(assignments);
    console.log(`Inserted ${assignments.length} assignments`);

    console.log("Inserting enrollments...");
    await EnrollmentModel.insertMany(enrollments);
    console.log(`Inserted ${enrollments.length} enrollments`);

    console.log("\nSeed completed successfully!");
    console.log("Summary:");
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Courses: ${courses.length}`);
    console.log(`  - Modules: ${modules.length}`);
    console.log(`  - Assignments: ${assignments.length}`);
    console.log(`  - Enrollments: ${enrollments.length}`);

  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

seed();
