"use client";

import React from "react";
import Link from "next/link";
import { DividerVerticalIcon } from "@/components/icons";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-primary">
      <div className="container mx-auto px-2 md:px-10 my-6 flex flex-wrap items-center justify-center md:justify-between gap-4">
        <div className="flex flex-row gap-3 font-semibold text-white">
          <div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:underline hover:underline-offset-2"
            >
              Главная
            </Link>
          </div>
          <DividerVerticalIcon />
          <div>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:underline hover:underline-offset-2"
            >
              Новости
            </Link>
          </div>
          <DividerVerticalIcon />
          <div>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all hover:underline hover:underline-offset-2"
            >
              Документы
            </Link>
          </div>
        </div>
        <div className="text-white font-semibold flex gap-3 items-center">
          Разработано для Код Согласия
        </div>
      </div>
    </footer>
  );
};
