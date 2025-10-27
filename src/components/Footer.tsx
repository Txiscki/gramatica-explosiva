import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        © 2025 The Grammar Bomb · Created by Txiscki with the help of ChatGPT ·{" "}
        <Link 
          to="/legal-notice" 
          className="text-primary hover:underline"
        >
          Legal Notice
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
