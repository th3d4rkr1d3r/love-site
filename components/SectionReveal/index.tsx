"use client";

import { motion } from "framer-motion";

type SectionRevealProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function SectionReveal({ children, className, id }: SectionRevealProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 56, scale: 0.97, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, ease }}
      className={className}
    >
      {children}
    </motion.section>
  );
}
