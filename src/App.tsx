import { useState, useEffect } from 'react'
import './App.css'

interface Profile {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
}

interface Skill {
  id: number;
  name: string;
  category: string;
  level: string;
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, skillsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/skills'),
        ]);

        if (!profileRes.ok || !skillsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const profileData = await profileRes.json();
        const skillsData = await skillsRes.json();

        setProfile(profileData);
        setSkills(skillsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1>Resume</h1>
      {profile && (
        <div className="card">
          <h2>{profile.name}</h2>
          <h3>{profile.title}</h3>
          <p>{profile.email} | {profile.phone}</p>
          <p>{profile.location}</p>
          <p>{profile.summary}</p>
        </div>
      )}

      <div className="card">
        <h3>Skills</h3>
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>
              {skill.name} - {skill.level} ({skill.category})
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
