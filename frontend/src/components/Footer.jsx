import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaCode, FaGlobe } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const socialLinks = [
    { 
      icon: FaGlobe, 
      href: 'https://avijitdampf.netlify.app', 
      label: 'Portfolio',
      color: 'hover:text-blue-500',
      hoverBg: 'group-hover:bg-blue-500/10'
    },
    { 
      icon: FaGithub, 
      href: 'https://github.com', 
      label: 'GitHub',
      color: 'hover:text-gray-800 dark:hover:text-white',
      hoverBg: 'group-hover:bg-gray-500/10'
    },
    { 
      icon: FaLinkedin, 
      href: 'https://linkedin.com/in/avijit-dam-a45814208', 
      label: 'LinkedIn',
      color: 'hover:text-blue-600',
      hoverBg: 'group-hover:bg-blue-600/10'
    },
    { 
      icon: FaTwitter, 
      href: 'https://x.com/AVIJITD76704128', 
      label: 'Twitter',
      color: 'hover:text-sky-500',
      hoverBg: 'group-hover:bg-sky-500/10'
    }
  ];

  return (
    <footer className="fixed bottom-0 w-full z-50">
      {/* Glassmorphism effect with improved blur */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg" />
      
      {/* Multiple animated gradient borders */}
      <div className="absolute top-0 left-0 w-full h-[2px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-gradient-x" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-gradient-x [animation-delay:500ms] opacity-75" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-gradient-x [animation-delay:1000ms] opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand section with enhanced hover effect */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative group cursor-pointer"
            >
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 hover:from-pink-500 hover:via-purple-500 hover:to-indigo-600 transition-all duration-500">
                AvijitDam
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-pink-500 group-hover:w-full transition-all duration-300" />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400"
            >
              <FaCode className="w-4 h-4" />
              <span> {currentYear}</span>
            </motion.div>
          </motion.div>

          {/* Center section with enhanced heart animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400"
          >
            <span className="font-medium">Crafted with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              <FaHeart className="text-red-500 w-4 h-4 hover:text-pink-500 transition-colors duration-300" />
            </motion.div>
            <span className="font-medium">in India</span>
          </motion.div>

          {/* Social links with enhanced hover effects */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center space-x-6"
          >
            <AnimatePresence>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-2 rounded-full transition-all duration-300"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 } 
                  }}
                  onHoverStart={() => setHoveredIcon(social.label)}
                  onHoverEnd={() => setHoveredIcon(null)}
                >
                  <div className={`absolute inset-0 rounded-full transition-all duration-300 ${social.hoverBg} opacity-0 group-hover:opacity-100`} />
                  <social.icon className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-all duration-300 ${social.color} relative z-10`} />
                  <motion.span 
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ 
                      scale: hoveredIcon === social.label ? 1 : 0.8,
                      opacity: hoveredIcon === social.label ? 1 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {social.label}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45" />
                  </motion.span>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
