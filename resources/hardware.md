# Hardware available this weekend

Ours: NVIDIA DGX Spark, 3D printer. Borrowed from MLH: everything in the rental list.

Sources: organizer doc (full rental list), MLH page https://www.mlh.com/resources/hardware (descriptions + guides), user (DGX Spark, 3D printer). Notes marked *general* are my background knowledge, not from MLH.

## Getting MLH rentals
Check out at the MLH hardware table (by the check-in tables) with an organizer. Hardware track judging: [tracks/hardware.md](tracks/hardware.md).

## MLH rental list (organizer doc)
| Item | MLH page description / guide |
|---|---|
| Raspberry Pi kits | MLH page: "Raspberry Pi Pico and RP2040", a classic starter. Intro playlist: https://www.youtube.com/playlist?list=PLEBQazB0HUyQO6rJxKr2umPCgmfAU-cqR . Check at the table whether a kit is a Pico or a full Pi |
| Arduinos and base shields | Install the Arduino IDE (Mac/Windows/Linux): https://www.arduino.cc/en/software . Project to Product playlist: https://www.youtube.com/playlist?list=PLEBQazB0HUyQd6Fsf5NQ75M9llbi1_j_8 |
| Logitech webcams | no guide on MLH page. *General:* standard USB (UVC) webcams, work with OpenCV, MediaPipe and browser `getUserMedia` |
| Google Home Mini | Set-up guide: https://support.google.com/googlenest/answer/7029485?hl=en&co=GENIE.Platform%3DAndroid |
| SenseCAP Indicator | no guide on MLH page. *General:* Seeed Studio touchscreen IoT panel (ESP32-S3 + RP2040) with Grove ports and environmental sensors (CO2, VOC, temperature, humidity). Check the exact variant at the table |
| Echo Show | Amazon Echo set-up guides: https://www.amazonforum.com/s/echo-family |
| Echo Dot (4th and 5th gen) | same guide as Echo Show |
| Assorted breadboards | |
| Wire cutters | |
| Multimeter | |
| Assorted cables | |
| Assorted Grove components | *General:* Seeed Grove modular sensors/actuators on a standard 4-pin connector; plug into Grove base shields |

Stock counts, exact models and per-team limits are not published.

## NVIDIA DGX Spark (user-provided)
Our own compute box, not an MLH rental. *General:* desktop AI computer with the GB10 Grace Blackwell chip (20-core Arm CPU), 128 GB unified memory, about 1 PFLOP FP4, ships with NVIDIA DGX OS (Ubuntu-based) and the NVIDIA AI software stack; good for running large local models (tens of billions of parameters) and fine-tuning. Unknowns: how it is networked at the venue and whether we can reach it from laptops and a Pi/Arduino over the venue Wi-Fi.

## 3D printer (user-provided)
A "nice" 3D printer is available to the team. Unknown: model, build volume, filament types/colors, queue and sign-up process, max print time.

## Open questions
- Which Raspberry Pi models, how many of each item, check-out limits.
- 3D printer details above.
