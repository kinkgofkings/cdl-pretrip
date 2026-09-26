export interface PdfPageData {
  pageNumber: number;
  title: string;
  subtitle: string;
  sectionsCovered: string;
  summaryHighlights: string[];
  imageUrl: string;
  pdfExcerpt: string;
}

export const ANCORA_PDF_PAGES: PdfPageData[] = [
  {
    pageNumber: 1,
    title: 'Pre-Inspection, Engine Bay & Front Axle',
    subtitle: 'Sections I, II & III: Setup, COPS Leaks, Engine Compartment, Steering & Suspension',
    sectionsCovered: 'Section I (Setup/Front), Section II (Engine Bay), Section III (Steering, Suspension & Front Brakes)',
    summaryHighlights: [
      'Chocks on wheels; keys in pocket.',
      'Leaks (COPS): Coolant, Oil, Power Steering Fluid.',
      'Script: "I see no coolant, oil or power steering leaks; there is no oil or fluid dripping from the engine or the transmission. The truck is not leaning to the left or the right."',
      'Driver side oil dipstick: "I would pull the oil level stick, wipe, and reinsert it - the level must be above refill mark."',
      'Steering gear box leaks: "**I see no leaks from my steering gear box.**"',
      'Front brake hose: securely mounted, not cut, cracked, dry-rotted, or bulging; I hear no air leaks.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80',
    pdfExcerpt: `ANCORA CLASS A PRE-TRIP INSPECTION
Master Study Guide & Exam Script Checklist - Page 1 of 6

CRITICAL RANGE RULE: Always physically go, point at, and touch every single element of the exterior and in-cab inspection! Spoken text/scripts that you must say out loud are highlighted inside the blue boxes below.

I. PRE-INSPECTION & SETUP / FRONT OF VEHICLE
[ ] Chocks/Keys: Wheels are chocked; keys are in my pocket.
[ ] Lenses: Clearance, signal, marker lights and headlights - Not chipped, cracked, broken and they are clean and of correct color.
[ ] Vehicle Stance: The truck is not leaning left or right.
[ ] Leaks (COPS): Check under the truck for Coolant, Oil, Power Steering Fluid leaks.
SCRIPT TO SAY OUT LOUD:
"I see no coolant, oil or power steering leaks; there is no oil or fluid dripping from the engine or the transmission. The truck is not leaning to the left or the right."

II. ENGINE COMPARTMENT
Passenger Side
[ ] Coolant Reservoir: Not damaged, filled to proper level, I see no fluid leaks.
[ ] Hoses & Wires: I see no frayed/exposed wires; no damaged, leaking, or dry-rotted hoses.
Driver Side
[ ] Hoses & Wires: I see no frayed/exposed wires; no damaged, leaking, or dry-rotted hoses.
[ ] Oil Level: Checked with engine OFF.
SCRIPT TO SAY OUT LOUD:
"I would pull the oil level stick, wipe, and reinsert it - the level must be above refill mark."
[ ] Power Steering Reservoir: Filled to proper level, hoses secure, I see no leaks.

III. STEERING, SUSPENSION & BRAKES (FRONT AXLE)
Steering System
[ ] Components: Steering rod and joints, Steering gear box, Pitman arm, Drag link, Steering knuckle, Tie rod.
[ ] Condition & Leaks: Securely mounted, not worn/cracked/broken, no missing nuts/bolts/cotter keys. All joints and sockets are not worn or loose. **I see no leaks from my steering gear box.**
Suspension
[ ] Leaf Springs & Mounts: Leaf spring mounts front and back - Not shifted, cracked, or broken, no missing parts.
[ ] U-Bolts: Securely mounted, none missing or broken.
[ ] Shock Absorber: Not damaged, securely mounted; I see no fluid leaks.
Brakes (Front)
[ ] Brake Hose: Securely mounted, not cut, cracked, dry-rotted, or bulging; I hear no air leaks.`
  },
  {
    pageNumber: 2,
    title: 'Wheel & Tire, Side, Coupling & Trailer Nose',
    subtitle: 'Sections IV, V, VI & VII: Steer Tire ICD, Fifth Wheel "No Gap", Kingpin & Landing Gear',
    sectionsCovered: 'Section IV (Wheel/Tire Steer), Section V (Side), Section VI (Coupling), Section VII (Trailer)',
    summaryHighlights: [
      'Brake Linings not dangerously thin, no oil or grease; Brake Drum not cracked, no illegal welds.',
      'Steer Tire: No less than 4/32" min depth; tread evenly worn; no cuts/bulges/damage on sidewalls.',
      'Tire Pressure Script: "I would use an Air Pressure gauge to check tire pressure."',
      'Physical action: Close the hood and latch it.',
      'Fifth Wheel Skid Plate: Properly greased. "**I see no gap between the trailer apron and the fifth wheel skid plate.**"',
      'Landing Gear script: "The fifth wheel skid plate is positioned so that the landing gear clears the tractor frame when turning."'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80',
    pdfExcerpt: `ANCORA CLASS A PRE-TRIP INSPECTION (CONT.)
Master Study Guide & Exam Script Checklist - Page 2 of 6

[ ] Brake Linings: Not dangerously thin; I see no signs of oil or grease.
[ ] Brake Drum: Not cracked/broken; no illegal welds; no signs of oil or grease.

IV. WHEEL & TIRE (STEER AXLE)
[ ] Tire: No less than 4/32" min depth; tread evenly worn; no cuts/bulges/damage on sidewalls (inner and outer).
[ ] Valve Stem and Cap: Valve stem and cap are securely mounted.
SCRIPT TO SAY OUT LOUD:
"I would use an Air Pressure gauge to check tire pressure."
[ ] Rim: Not damaged, cracked, or bent; no welds other than factory.
[ ] Lug Nuts: No missing lug nuts, or studs, no rust trails or shiny threads, or elongated holes.
PHYSICAL ACTION REQUIRED:
Now close the hood and latch it.

V. SIDE OF VEHICLE
[ ] Mirrors & Brackets: Clean, not cracked/broken, securely mounted. No missing nuts or bolts.
[ ] Signal & Marker Light: Not chipped, cracked or broken. Clean and of the correct color.
[ ] Fuel/DEF Tanks: Fuel tank and DEF tanks, securely mounted, not damaged, caps are secure, fuel and DEF lines and wires are not damaged, I see no fluid leaks.
[ ] Battery Box: Open box; batteries securely attached, cables not worn, no excessive corrosion. Close the box cover and confirm it is secure.
[ ] Frame & Crossmembers: No holes, no illegal welds, no missing nuts or bolts or missing cross members.

VI. COUPLING SYSTEM
[ ] Air & Electric Lines: Securely mounted to the truck and the trailer. They are not cut, cracked, chaffed, taped or worn. I hear no air leaks. Air lines and electric lines are securely seated - not tangled, crimped, pinched or dragging on the catwalk.
[ ] Release Arm: Securely mounted. No missing nuts or bolts. It is in the locked position.
[ ] 5th Wheel Skid Plate: Properly greased. **I see no gap between the trailer apron and the fifth wheel skid plate.** Securely mounted to the platform. If sliding 5th wheel, locking pins are in locked position.
[ ] Kingpin & Apron: Kingpin is not bent, damaged or worn; Apron is not cracked or broken.
[ ] Locking Jaws: Not cracked, broken or damaged. Jaws are locked around kingpin shank; there is no play between jaws and kingpin.
[ ] Tractor Lights: Tractor taillights and reflectors, not chipped, cracked, broken or damaged, clean and of the correct color RED.

VII. TRAILER
[ ] Trailer Structure: Trailer frame and crossmembers; Not damaged, no cracks, holes or broken welds. Trailer floor - No breaks or holes. No missing cross members.
[ ] Landing Gear: The landing gear frame and landing gear pads are not cracked, broken or damaged. It is fully raised and the crank handle is secured.
SCRIPT TO SAY OUT LOUD:
"The fifth wheel skid plate is positioned so that the landing gear clears the tractor frame when turning."`
  },
  {
    pageNumber: 3,
    title: 'Trailer Rear, Tandems & In-Cab Inspection',
    subtitle: 'Section VII (Trailer End) & Section VIII: Key Sequence, Safe Start, Governor Build-Up, Horns & Climate',
    sectionsCovered: 'Section VII (Tandems, DOT Tape, Rear Lights) & Section VIII (In-Cab Inspection)',
    summaryHighlights: [
      'Sliding Tandems script: "My trailer sliding tandems are not bent, cracked, or broken; locking pins are fully engaged and extended, and the release handle/button is in the locked position."',
      'Key Sequence: Turn key to ON for electrical power. Verify ABS lights on dash and trailer, plus DEF/REGEN.',
      'Pump brake pedal a few times so pressure drops to prepare for governor cut-off check.',
      'Safe Start script: "Now I will Perform a Safe Start: My truck is in neutral, brakes are set."',
      'Air Build Up script: "I will allow my air to build to a SAFE OPERATING LEVEL, I will listen for my AIR GOVERNOR TO CUT OFF at appx. 120 to 140 PSI."',
      'Governor announcement: "My AIR GOVERNOR has CUT OFF at 120-140 on my Primary and 120-140 on my secondary."',
      'In-cab horns, windshield, wipers, defroster, and 4-way flasher indicators.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1586191582056-a19dd5183350?auto=format&fit=crop&w=1200&q=80',
    pdfExcerpt: `ANCORA CLASS A PRE-TRIP INSPECTION (CONT.)
Master Study Guide & Exam Script Checklist - Page 3 of 6

[ ] Trailer Lights & Tandems: Trailer clearance light, signal marker, marker lights and ABS light - not chipped, cracked, broken or damaged - clean and of the correct color.
[ ] Sliding Tandems: Locking handle and pins are in the locked position.
SCRIPT TO SAY OUT LOUD:
"My trailer sliding tandems are not bent, cracked, or broken; locking pins are fully engaged and extended, and the release handle/button is in the locked position."
[ ] DOT Tape: (Rear of Trailer) DOT Tape is not missing or peeling and runs the length and width of the trailer.
[ ] Trailer Lights Rear: Clearance, ID, marker and signal lights are not chipped, cracked, broken or damaged, and they are clean and of the correct color of RED.

VIII. IN-CAB INSPECTION
[ ] Key Sequence: Turn the key to your right, to the ON position so you have electrical power.
SCRIPT TO SAY OUT LOUD:
"My ABS lights have both come on and off on the dash and the trailer and my DEF and REGEN lights are all functioning properly."
PHYSICAL ACTION REQUIRED:
Pump the brake pedal a few times so you can hear your air governor cut off!

[ ] Safe Start: Perform safe engine start.
SCRIPT TO SAY OUT LOUD:
"Now I will Perform a Safe Start: My truck is in neutral, brakes are set."

[ ] Air Build Up: Monitor progress.
SCRIPT TO SAY OUT LOUD:
"I will allow my air to build to a SAFE OPERATING LEVEL, I will listen for my AIR GOVERNOR TO CUT OFF at appx. 120 to 140 PSI."
PHYSICAL ACTION REQUIRED:
Sit, listen, and wait for it to happen!!!!
SCRIPT TO SAY OUT LOUD:
"My AIR GOVERNOR has CUT OFF at ________ on my Primary and ________ on my secondary."

[ ] Horns, Visibility, Climate & Indicators: Check operational controls inside the cab.
SCRIPT TO SAY OUT LOUD:
"My city and highway horns work properly. My windshield is clean, free of illegal stickers, and not cracked or damaged. My mirrors are clean and adjusted to me. My wiper arms and blades are secure, the rubber is not damaged, and the wipers and washer fluid function properly. My heater and defroster are functional and working properly. My left turn signal, right turn signal, high beam headlight, and four-way hazard dashboard indicators are all operational and functioning properly."

[ ] Emergency Equipment: The fire extinguisher is securely mounted and fully charged. Spare fuses are onboard, and I have three reflective triangles in the red box under the rear seat.`
  },
  {
    pageNumber: 4,
    title: 'Air Brake Tests (Critical Failure Zone)',
    subtitle: 'Section IX: Applied Leak Test, 60s Timer, and 60 PSI Low Air Warning Alarm',
    sectionsCovered: 'Section IX: Air Brake Execution Steps 1 through 6',
    summaryHighlights: [
      'CRITICAL FAILURE ZONE: Missing a step here is an automatic failure on the exam.',
      '1. Shutdown Setup: "I am shutting off my engine and turning my key back to the ON position so that I have electrical power."',
      '2. Settle Air: Push both knobs in. "I will release my brakes and allow the air to settle."',
      '3. Explain Test: "Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds."',
      '4. Execute Timer: Put foot on pedal FIRST then start timer. Look at key and brake knobs outstretched - do NOT touch them.',
      '5. Announce Result: "I did NOT lose more than 4 PSI in 60 Seconds."',
      '6. Low Air Alarm Test: Fan brakes until light and alarm cut on: "My low air alarm and light CUT ON at 60 PSI."'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80',
    pdfExcerpt: `AIR BRAKE TESTS (CRITICAL FAILURE ZONE)
Master Study Guide & Exam Script Checklist - Page 4 of 6

TEST               ACTION                                                        REQUIREMENT
Applied Leak Test  Key ON/Engine OFF. Hold service brake 60s. Fan brakes...      Lose max 4 PSI
Low Air Warning    Fan brakes until alarm/light cuts on.                         Approx. 60 PSI
Spring Brake Pop   Continue fanning brakes.                                      Knobs pop at approx. 40-20 PSI

Air Brake Leak Check Execution Procedures
[ ] 1. Shutdown Setup: "I am shutting off my engine and turning my key back to the ON position so that I have electrical power."
[ ] 2. Settle Air:
PHYSICAL ACTION REQUIRED:
Push both knobs in.
SCRIPT TO SAY OUT LOUD:
"I will release my brakes and allow the air to settle."

[ ] 3. Explain Test:
SCRIPT TO SAY OUT LOUD:
"Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds."

[ ] 4. Execute Timer:
PHYSICAL ACTION REQUIRED:
Put your foot on the pedal FIRST then START your timer. While doing this, LOOK at your key and brake knobs to double check the key is turned to the right fully and the brake knobs are outstretched - but NOT touch them!

[ ] 5. Announce Result:
SCRIPT TO SAY OUT LOUD (AFTER 60 SECONDS):
"I did NOT lose more than 4 PSI in 60 Seconds."

[ ] 6. Low Air Alarm Test:
PHYSICAL ACTION REQUIRED:
Fan your brakes until the light and alarm cut on, then stop fanning.
SCRIPT TO SAY OUT LOUD:
"My low air alarm and light CUT ON at ________ PSI."`
  },
  {
    pageNumber: 5,
    title: 'Spring Brake Pop, Air Re-Build, Chocks & Tug Tests',
    subtitle: 'Section IX (Steps 7–10) & Section X: 40/20 PSI Pop, Air Build to 120-140 PSI, Chock Retrieval & Tug Tests',
    sectionsCovered: 'Section IX (Steps 7 through 10) & Section X (Final Brake Checks)',
    summaryHighlights: [
      '7. Spring Brake Test: "Now I will continue to fan my brakes until my trailer and tractor brakes set which should happen at about 40/20 PSI."',
      'Fan until BOTH knobs pop out: "My trailer brakes have set at 40 and my Tractor brakes have set at 20."',
      '8. Re-Build Air: Perform SAFE START. "Now I will allow my air pressure to build to approximately 60 PSI at which point my Low Air Alarm and Light should CUT OFF."',
      '9. Air Governor Cut Off: "My Air Governor has CUT OFF at 120-140 on my Primary and 120-140 on my secondary."',
      '10. Chock Retrieval: Exit cab using 3 points of contact, retrieve chocks, re-enter with 3 points, put seat belt on.',
      'Parking Brake Tug: Pull yellow, push red. Tug twice in Drive: "Parking Brakes Hold."',
      'Trailer Brake Tug: Pull red, push yellow. Tug twice in Drive: "Brakes held."',
      'Service Brake: "I will release both my tractor and trailer brakes, allow the truck to accelerate to approx. 5 MPH and apply the brakes. Brakes should function properly and the truck should not PULL left or right."'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=1200&q=80',
    pdfExcerpt: `AIR BRAKE TESTS (CONT.) & FINAL CHECKS
Master Study Guide & Exam Script Checklist - Page 5 of 6

[ ] 7. Spring Brake Test:
SCRIPT TO SAY OUT LOUD:
"Now I will continue to fan my brakes until my trailer and tractor brakes set which should happen at about 40/20 PSI."
PHYSICAL ACTION REQUIRED:
Fan until your brakes set (BOTH knobs pop out).
SCRIPT TO SAY OUT LOUD:
"My trailer brakes have set at ________ and my Tractor brakes have set at ________."

[ ] 8. Re-Build Air Pressure:
PHYSICAL ACTION REQUIRED:
Perform a SAFE START (Truck in neutral and my brakes are set. Start the truck).
SCRIPT TO SAY OUT LOUD:
"Now I will allow my air pressure to build to approximately 60 PSI at which point my Low Air Alarm and Light should CUT OFF."
SCRIPT TO SAY OUT LOUD:
"My Low Air Alarm and Light have CUT OFF at ________."

[ ] 9. Air Governor Cut Off:
PHYSICAL ACTION REQUIRED:
Sit and wait for the governor system to cycle.
SCRIPT TO SAY OUT LOUD:
"My Air Governor has CUT OFF at ________ on my Primary and ________ on my secondary."

[ ] 10. Chock Retrieval:
PHYSICAL ACTION REQUIRED:
Exit the cab using 3 points of contact and RETRIEVE your wheel chocks. Close the door when you get out and put them on the floor of the back seat. Reenter the cab using 3 points of contact and put your seat belt back on.

X. FINAL BRAKE CHECKS (TUG TEST / SERVICE BRAKE TEST)
[ ] Parking Brake: Pull yellow knob, push red. Tug twice in Drive.
SCRIPT TO SAY OUT LOUD:
"Parking Brakes Hold."

[ ] Trailer Brake: Pull red knob, push yellow. Tug twice in Drive.
SCRIPT TO SAY OUT LOUD:
"Brakes held."

[ ] Service Brake: Prepare for moving check.
SCRIPT TO SAY OUT LOUD:
"Now I will perform a service brake test. I will release both my tractor and trailer brakes, allow the truck to accelerate to approx. 5 MPH and apply the brakes. Brakes should function properly and the truck should not PULL left or right."`
  },
  {
    pageNumber: 6,
    title: 'Final Moving Brake Action, Exterior Lights & Conclusion',
    subtitle: 'Section X (Moving Brake), Section XI (Exterior Light Check) & Official Conclusion Script',
    sectionsCovered: 'Section X (Physical Service Brake 5 MPH), Section XI (Exterior Light Assist), Conclusion',
    summaryHighlights: [
      'Physical Service Brake Action: Push both knobs in, drive 5 mph and brake firmly.',
      'Script: "Brakes functioned properly, and the truck did not pull left or right."',
      'Section XI Shutdown Sequence: Set brakes, put truck in neutral, shut engine OFF.',
      'Script: "I am shutting my engine off and turning my key to the on position so that I have electrical power. I am checking to make sure my lights are on."',
      'Examiner Request script: "I have turned on all of my lights for the light operation check. Would you please assist me with my exterior light check?"',
      'Direct examiner all the way around the truck covering ALL lights (Front, Sides, Rear).',
      'Official Exam Conclusion Script: "This concludes my Pretrip and In-cab Inspection."'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    pdfExcerpt: `FINAL BRAKE ACTION, EXTERIOR LIGHTS & CONCLUSION
Master Study Guide & Exam Script Checklist - Page 6 of 6

PHYSICAL ACTION REQUIRED:
Push both knobs in, drive 5 mph and brake firmly.
SCRIPT TO SAY OUT LOUD:
"Brakes functioned properly, and the truck did not pull left or right."

XI. EXTERIOR LIGHT CHECK
[ ] Shutdown Sequence: Set your brakes. Put truck in neutral. Shut your engine OFF.
SCRIPT TO SAY OUT LOUD:
"I am shutting my engine off and turning my key to the on position so that I have electrical power. I am checking to make sure my lights are on."

[ ] Examiner Request: Activate systems and request physical external assistance.
PHYSICAL ACTION REQUIRED:
Turn on all lights and switches to prepare for the comprehensive light operation check.
SCRIPT TO SAY OUT LOUD:
"I have turned on all of my lights for the light operation check. Would you please assist me with my exterior light check?"
PHYSICAL ACTION REQUIRED:
Direct the examiner all the way around the truck covering ALL lights (Front, Sides, Rear).

CONCLUSION
SCRIPT TO SAY OUT LOUD:
"This concludes my Pretrip and In-cab Inspection."`
  }
];
