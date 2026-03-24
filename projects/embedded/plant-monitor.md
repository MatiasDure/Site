---
title: "Smart Plant Monitor"
description: "An ESP32-based soil moisture and temperature monitoring system with a web dashboard for real-time sensor data visualization."
featured: true
tags: ["ESP32", "C++", "MQTT", "IoT", "Arduino"]
coverImage: "/images/projects/plant-monitor.png"
demo: ""
repo: "https://github.com/example/plant-monitor"
---

## Overview

An IoT system that monitors plant soil moisture, temperature, and humidity using an ESP32 microcontroller. Sensor data is published via MQTT to a local broker, consumed by a lightweight web dashboard for real-time visualization.

## Tech Stack

- **Microcontroller**: ESP32-WROOM-32
- **Language**: C++ (Arduino framework via PlatformIO)
- **Protocol**: MQTT (Mosquitto broker)
- **Dashboard**: Node-RED + MQTT

## Key Features

- Reads soil moisture (capacitive sensor), temperature and humidity (DHT22)
- Publishes to MQTT topic every 30 seconds
- Deep-sleep between readings for battery operation
- Wi-Fi provisioning via BLE on first boot
