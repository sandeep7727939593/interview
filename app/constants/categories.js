import { BookOpen, Code, Database, Cpu, Layers } from "lucide-react";

export const CATEGORIES = [
  { id: "react", name: "React", icon: <Code size={16} /> },
  { id: "nodejs", name: "Node.js", icon: <Database size={16} /> },
  { id: "javascript", name: "JavaScript", icon: <Code size={16} /> },
  { id: "system-design", name: "System Design", icon: <Layers size={16} /> },
  { id: "aws", name: "AWS", icon: <Cpu size={16} /> },
  { id: "other", name: "Other", icon: <BookOpen size={16} /> }
];
