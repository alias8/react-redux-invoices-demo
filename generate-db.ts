import { writeFileSync } from 'fs';
import { join } from 'path';

interface Profile {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Experience {
  id: number;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
}

interface Education {
  id: number;
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
}

interface DatabaseData {
  profile: Profile;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

const dbData: DatabaseData = {
  profile: {
    id: 1,
    name: "James Kirk",
    title: "Software Engineer",
    email: "james.kirk@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    summary: "Experienced software engineer with a passion for building scalable web applications."
  },
  experience: [
    {
      id: 1,
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2020-01",
      endDate: null,
      current: true,
      description: "Leading development of cloud-based enterprise applications using React and Node.js."
    },
    {
      id: 2,
      company: "StartupXYZ",
      position: "Full Stack Developer",
      startDate: "2018-06",
      endDate: "2019-12",
      current: false,
      description: "Developed and maintained full-stack web applications using modern JavaScript frameworks."
    }
  ],
  education: [
    {
      id: 1,
      institution: "University of California",
      degree: "Bachelor of Science in Computer Science",
      startDate: "2014-09",
      endDate: "2018-05",
      gpa: "3.8"
    }
  ],
  skills: [
    {
      id: 1,
      name: "JavaScript",
      category: "Programming Languages",
      level: "Expert"
    },
    {
      id: 2,
      name: "TypeScript",
      category: "Programming Languages",
      level: "Expert"
    },
    {
      id: 3,
      name: "React",
      category: "Frameworks",
      level: "Expert"
    },
    {
      id: 4,
      name: "Node.js",
      category: "Runtime",
      level: "Advanced"
    }
  ]
};

// Write the data to db.json
const outputPath = join(__dirname, 'db.json');
writeFileSync(outputPath, JSON.stringify(dbData, null, 2), 'utf-8');

console.log('✓ Generated db.json successfully');