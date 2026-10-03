
# UNDO — Ctrl+Z for the physical world

**Build a workbench that remembers what you took apart—and guides you back to a working state.**

Imagine disassembling a device, changing several connections, then realizing it no longer works. Turn a physical rewind dial to “the last time it worked.” UNDO shows exactly what changed, gives instructions to reverse those changes, and checks whether the repair succeeded.

The theme is **navigating the history of physical work**. The audience is makers, students learning electronics, and people repairing things.

## The demonstration

Place a small working, low-voltage light assembly on the table, with labelled removable connections and a webcam overhead.

1. A judge disconnects and rearranges several components. The light stops working.
2. They turn a 3D-printed rewind dial. The screen scrubs through the assembly’s actual history.
3. Selecting a previous state produces a highlighted difference: **“Reconnect the blue lead to socket B.”** Spoken instructions guide the repair.
4. The system observes each correction. An electrical check verifies the restored connection, and the light turns back on.

**The payoff is a physical object working again because the system remembered how it changed.**

A remote teammate can also inspect a saved state through iMessage and propose a correction that appears on the workbench display.

## Ten plausible track entries

| Track                      | Substantive contribution                                                                     |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| **BigRed**           | A tangible interpretation of navigation through time, configurations, and repair decisions.  |
| **Hardware**         | Instrumented circuit, physical rewind control, and electrical verification.                  |
| **Software**         | Reconstructing states and calculating valid steps between them.                              |
| **Design**           | A clear “before/current/target” interface and intuitive physical control.                  |
| **People’s Choice** | Judges break something and personally bring it back to life.                                 |
| **Gemini**           | Interprets questions and visual observations; explains verified changes.                     |
| **Tiger Data**       | Stores timestamped component changes and reconstructs the work history.                      |
| **ElevenLabs**       | Hands-free instructions while users handle components.                                       |
| **Photon**           | A human mentor reviews an exact historical state and collaborates through Spectrum/iMessage. |
| **GoDaddy Registry** | A qualifying domain hosting the project and demonstration.                                   |

I would prioritize **Hardware, Tiger Data, Design, and BigRed**. Leave the other sponsor integrations outside this build.

## Make the distinctive capability real

Related [AR assembly research already detects mistakes and guides recovery](https://authors.library.caltech.edu/records/242tm-f6y12). The contribution to demonstrate here is **an inspectable history of your own physical work, controlled by a rewind dial, with verified restoration**.

For the weekend:

- Support one fixture with six to eight labelled components and known connection rules.
- Combine camera observations with electrical sensing; uncertain observations require confirmation.
- Use a deterministic planner for restoration steps. Gemini explains those steps.
- Assign one engineer to perception, one to history/planning, one to interface and sponsor integrations, and the hardware teammate to the fixture and controls.
- Build the complete break → rewind → repair → verification loop before adding remote collaboration.

## Success criteria and assumptions

- Restore three different judge-selected connection changes.
- Return to an intermediate configuration after several edits.
- Detect an obscured component and request a clearer view.
- Complete the live demonstration within two minutes.

The prototype covers a controlled fixture; arbitrary-device repair is future work. Hardware availability and current prize-stacking rules need confirmation. **Ten is the number of credible entry opportunities, not a prediction of wins.**
