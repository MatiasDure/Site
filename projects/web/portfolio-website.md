---
title: "Portfolio Website"
description: "A personal portfolio site built with Next.js, TailwindCSS, and TypeScript, deployed to Vercel."
featured: true
tags: ["Next.js", "TypeScript", "TailwindCSS", "Vercel"]
coverImage: "/images/projects/portfolio.png"
demo: "https://example.com"
repo: "https://github.com/example/portfolio"
---

## Overview

This portfolio website showcases my work across web, app, game, and embedded domains. Built with Next.js App Router and TailwindCSS, it features a responsive landing page, domain-scoped project grids, full project detail pages, and a live activity section powered by Spotify and MyAnimeList APIs.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: TailwindCSS 4
- **Hosting**: Vercel with ISR

## Key Features

- Static generation for all project pages via `generateStaticParams`
- ISR on the landing page for fresh Spotify/anime data every 10 minutes
- Fully accessible with keyboard navigation and ARIA labels
- Dark mode support via `prefers-color-scheme`
