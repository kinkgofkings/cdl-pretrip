import { InspectionSection } from '../types';

export const INSPECTION_SECTIONS: InspectionSection[] = [
  {
    id: 'section-1',
    number: 'I',
    title: 'Pre-Inspection & Setup / Front of Vehicle',
    subtitle: 'Chocks/Keys, Lenses, Vehicle Stance, and Leaks (COPS)',
    category: 'exterior',
    vehicleLocation: 'front',
    truckCoordinates: { x: 50, y: 12 },
    criticalRule: 'CRITICAL RANGE RULE: Always physically go, point at, and touch every single element of the exterior and in-cab inspection! Spoken text/scripts that you must say out loud are highlighted inside the blue boxes below.',
    items: [
      {
        id: 'item-1-1',
        label: 'Chocks/Keys',
        details: 'Wheels are chocked; keys are in my pocket.',
        physicalAction: 'Physically check wheel chocks and ensure ignition keys are in your pocket.',
        critical: true,
        tutorialTitle: 'Chocks/Keys Protocol',
        tutorialDescription: 'Wheels are chocked; keys are in my pocket.',
        pointsToInspect: ['Wheels are chocked', 'Keys are in my pocket'],
        componentLocation: 'Front Steer Tires & Driver Pocket'
      },
      {
        id: 'item-1-2',
        label: 'Lenses',
        details: 'Clearance, signal, marker lights and headlights - Not chipped, cracked, broken and they are clean and of correct color.',
        physicalAction: 'Point to clearance, signal, marker lights and headlights.',
        tutorialTitle: 'Front Lenses & Lights',
        tutorialDescription: 'Clearance, signal, marker lights and headlights - Not chipped, cracked, broken and they are clean and of correct color.',
        pointsToInspect: ['Clearance, signal, marker lights and headlights', 'Not chipped, cracked, broken', 'Clean and of correct color'],
        componentLocation: 'Cab Roof & Front Bumper'
      },
      {
        id: 'item-1-3',
        label: 'Vehicle Stance',
        details: 'The truck is not leaning left or right.',
        physicalAction: 'Step back and look across the front of the truck.',
        tutorialTitle: 'Vehicle Stance Check',
        tutorialDescription: 'The truck is not leaning left or right.',
        pointsToInspect: ['The truck is not leaning left or right'],
        componentLocation: 'Entire Front Profile'
      },
      {
        id: 'item-1-4',
        label: 'Leaks (COPS)',
        details: 'Check under the truck for Coolant, Oil, Power Steering Fluid leaks.',
        spokenScript: 'I see no coolant, oil or power steering leaks; there is no oil or fluid dripping from the engine or the transmission. The truck is not leaning to the left or the right.',
        physicalAction: 'Check under the truck for Coolant, Oil, Power Steering Fluid leaks.',
        critical: true,
        tutorialTitle: 'Leaks (COPS) & Stance Script',
        tutorialDescription: 'Check under the truck for Coolant, Oil, Power Steering Fluid leaks.',
        pointsToInspect: ['Coolant, Oil, Power Steering Fluid leaks', 'No oil or fluid dripping from engine or transmission', 'Truck not leaning to left or right'],
        componentLocation: 'Under Engine Bay & Ground'
      }
    ]
  },
  {
    id: 'section-2',
    number: 'II',
    title: 'Engine Compartment',
    subtitle: 'Passenger Side & Driver Side Checks',
    category: 'engine',
    vehicleLocation: 'engine_pass',
    truckCoordinates: { x: 42, y: 22 },
    criticalRule: 'Check fluids with engine OFF. Unlatch hood carefully and inspect both sides methodically.',
    items: [
      {
        id: 'item-2-1',
        label: 'Coolant Reservoir (Passenger Side)',
        details: 'Not damaged, filled to proper level, I see no fluid leaks.',
        physicalAction: 'Point to and touch coolant reservoir on the passenger side.',
        tutorialTitle: 'Coolant Reservoir (Passenger Side)',
        tutorialDescription: 'Not damaged, filled to proper level, I see no fluid leaks.',
        pointsToInspect: ['Not damaged', 'Filled to proper level', 'I see no fluid leaks'],
        componentLocation: 'Engine Bay - Passenger Side'
      },
      {
        id: 'item-2-2',
        label: 'Hoses & Wires (Passenger Side)',
        details: 'I see no frayed/exposed wires; no damaged, leaking, or dry-rotted hoses.',
        physicalAction: 'Trace passenger side electrical wires and hoses with hand.',
        tutorialTitle: 'Hoses & Wires (Passenger Side)',
        tutorialDescription: 'I see no frayed/exposed wires; no damaged, leaking, or dry-rotted hoses.',
        pointsToInspect: ['I see no frayed/exposed wires', 'No damaged, leaking, or dry-rotted hoses'],
        componentLocation: 'Engine Bay - Passenger Side'
      },
      {
        id: 'item-2-3',
        label: 'Hoses & Wires (Driver Side)',
        details: 'I see no frayed/exposed wires; no damaged, leaking, or dry-rotted hoses.',
        physicalAction: 'Trace driver side electrical wires and hoses with hand.',
        tutorialTitle: 'Hoses & Wires (Driver Side)',
        tutorialDescription: 'I see no frayed/exposed wires; no damaged, leaking, or dry-rotted hoses.',
        pointsToInspect: ['I see no frayed/exposed wires', 'No damaged, leaking, or dry-rotted hoses'],
        componentLocation: 'Engine Bay - Driver Side'
      },
      {
        id: 'item-2-4',
        label: 'Oil Level (Driver Side)',
        details: 'Checked with engine OFF.',
        spokenScript: 'I would pull the oil level stick, wipe, and reinsert it - the level must be above refill mark.',
        physicalAction: 'Point to the oil level dipstick with engine OFF.',
        critical: true,
        tutorialTitle: 'Oil Level Check Script',
        tutorialDescription: 'Checked with engine OFF.',
        pointsToInspect: ['Checked with engine OFF', 'Pull stick, wipe, reinsert', 'Level must be above refill mark'],
        componentLocation: 'Engine Block Lower - Driver Side'
      },
      {
        id: 'item-2-5',
        label: 'Power Steering Reservoir',
        details: 'Filled to proper level, hoses secure, I see no leaks.',
        physicalAction: 'Touch power steering reservoir and inspect lines.',
        tutorialTitle: 'Power Steering Reservoir',
        tutorialDescription: 'Filled to proper level, hoses secure, I see no leaks.',
        pointsToInspect: ['Filled to proper level', 'Hoses secure', 'I see no leaks'],
        componentLocation: 'Driver Side Engine Bay'
      }
    ]
  },
  {
    id: 'section-3',
    number: 'III',
    title: 'Steering, Suspension & Brakes (Front Axle)',
    subtitle: 'Steering System, Suspension, and Brakes (Front)',
    category: 'suspension',
    vehicleLocation: 'steer_axle',
    truckCoordinates: { x: 38, y: 30 },
    criticalRule: 'Steering and brake components are zero-tolerance safety items on the CDL exam.',
    items: [
      {
        id: 'item-3-1',
        label: 'Components (Steering System)',
        details: 'Steering rod and joints, Steering gear box, Pitman arm, Drag link, Steering knuckle, Tie rod.',
        physicalAction: 'Point to and touch steering rod and joints, steering gear box, pitman arm, drag link, steering knuckle, and tie rod.',
        tutorialTitle: 'Steering System Components',
        tutorialDescription: 'Steering rod and joints, Steering gear box, Pitman arm, Drag link, Steering knuckle, Tie rod.',
        pointsToInspect: ['Steering rod and joints', 'Steering gear box', 'Pitman arm', 'Drag link', 'Steering knuckle', 'Tie rod'],
        componentLocation: 'Driver Steer Axle & Frame'
      },
      {
        id: 'item-3-2',
        label: 'Condition & Leaks (Steering System)',
        details: 'Securely mounted, not worn/cracked/broken, no missing nuts/bolts/cotter keys. All joints and sockets are not worn or loose. **I see no leaks from my steering gear box.**',
        spokenScript: 'I see no leaks from my steering gear box.',
        physicalAction: 'Inspect condition of all joints and sockets, checking for missing hardware and fluid leaks from steering gear box.',
        critical: true,
        tutorialTitle: 'Steering System Condition & Leaks',
        tutorialDescription: 'Securely mounted, not worn/cracked/broken, no missing nuts/bolts/cotter keys. All joints and sockets are not worn or loose. **I see no leaks from my steering gear box.**',
        pointsToInspect: ['Securely mounted, not worn/cracked/broken', 'No missing nuts/bolts/cotter keys', 'All joints and sockets not worn or loose', 'I see no leaks from my steering gear box'],
        componentLocation: 'Steering Gear Box & Linkages'
      },
      {
        id: 'item-3-3',
        label: 'Leaf Springs & Mounts (Suspension)',
        details: 'Leaf spring mounts front and back - Not shifted, cracked, or broken, no missing parts.',
        physicalAction: 'Inspect front and back mounts and leaf spring pack.',
        tutorialTitle: 'Leaf Springs & Mounts',
        tutorialDescription: 'Leaf spring mounts front and back - Not shifted, cracked, or broken, no missing parts.',
        pointsToInspect: ['Leaf spring mounts front and back', 'Not shifted, cracked, or broken', 'No missing parts'],
        componentLocation: 'Steer Axle Suspension'
      },
      {
        id: 'item-3-4',
        label: 'U-Bolts (Suspension)',
        details: 'Securely mounted, none missing or broken.',
        physicalAction: 'Touch U-bolts clamping axle to leaf spring.',
        tutorialTitle: 'U-Bolts Inspection',
        tutorialDescription: 'Securely mounted, none missing or broken.',
        pointsToInspect: ['Securely mounted', 'None missing or broken'],
        componentLocation: 'Steer Axle'
      },
      {
        id: 'item-3-5',
        label: 'Shock Absorber (Suspension)',
        details: 'Not damaged, securely mounted; I see no fluid leaks.',
        physicalAction: 'Inspect shock absorber mounting and casing for leaks.',
        tutorialTitle: 'Shock Absorber Check',
        tutorialDescription: 'Not damaged, securely mounted; I see no fluid leaks.',
        pointsToInspect: ['Not damaged', 'Securely mounted', 'I see no fluid leaks'],
        componentLocation: 'Steer Axle'
      },
      {
        id: 'item-3-6',
        label: 'Brake Hose (Brakes Front)',
        details: 'Securely mounted, not cut, cracked, dry-rotted, or bulging; I hear no air leaks.',
        physicalAction: 'Grip and trace front brake air hose.',
        critical: true,
        tutorialTitle: 'Front Brake Hose',
        tutorialDescription: 'Securely mounted, not cut, cracked, dry-rotted, or bulging; I hear no air leaks.',
        pointsToInspect: ['Securely mounted', 'Not cut, cracked, dry-rotted, or bulging', 'I hear no air leaks'],
        componentLocation: 'Behind Front Wheel'
      },
      {
        id: 'item-3-7',
        label: 'Brake Linings (Brakes Front)',
        details: 'Not dangerously thin; I see no signs of oil or grease.',
        physicalAction: 'Look into the brake inspection opening behind the rim.',
        critical: true,
        tutorialTitle: 'Brake Linings (Front)',
        tutorialDescription: 'Not dangerously thin; I see no signs of oil or grease.',
        pointsToInspect: ['Not dangerously thin', 'I see no signs of oil or grease'],
        componentLocation: 'Inside Front Steer Wheel Hub'
      },
      {
        id: 'item-3-8',
        label: 'Brake Drum (Brakes Front)',
        details: 'Not cracked/broken; no illegal welds; no signs of oil or grease.',
        physicalAction: 'Inspect brake drum surface through wheel openings.',
        critical: true,
        tutorialTitle: 'Brake Drum (Front)',
        tutorialDescription: 'Not cracked/broken; no illegal welds; no signs of oil or grease.',
        pointsToInspect: ['Not cracked/broken', 'No illegal welds', 'No signs of oil or grease'],
        componentLocation: 'Inside Front Steer Wheel Hub'
      }
    ]
  },
  {
    id: 'section-4',
    number: 'IV',
    title: 'Wheel & Tire (Steer Axle)',
    subtitle: 'Tire, Valve Stem & Cap, Rim, Lug Nuts, and Hood Latch',
    category: 'exterior',
    vehicleLocation: 'steer_axle',
    truckCoordinates: { x: 34, y: 35 },
    criticalRule: 'Steer tires CANNOT be recapped or retreaded and require at least 4/32 inch tread depth.',
    items: [
      {
        id: 'item-4-1',
        label: 'Tire',
        details: 'No less than 4/32" min depth; tread evenly worn; no cuts/bulges/damage on sidewalls (inner and outer).',
        physicalAction: 'Check tread depth with gauge or fingers and feel inner and outer sidewalls.',
        critical: true,
        tutorialTitle: 'Steer Axle Tire',
        tutorialDescription: 'No less than 4/32" min depth; tread evenly worn; no cuts/bulges/damage on sidewalls (inner and outer).',
        pointsToInspect: ['No less than 4/32" min depth', 'Tread evenly worn', 'No cuts/bulges/damage on sidewalls (inner and outer)'],
        keySpecs: 'Min 4/32" depth'
      },
      {
        id: 'item-4-2',
        label: 'Valve Stem and Cap',
        details: 'Valve stem and cap are securely mounted.',
        spokenScript: 'I would use an Air Pressure gauge to check tire pressure.',
        physicalAction: 'Touch valve stem and cap.',
        critical: true,
        tutorialTitle: 'Valve Stem and Cap',
        tutorialDescription: 'Valve stem and cap are securely mounted.',
        pointsToInspect: ['Valve stem and cap are securely mounted', 'I would use an Air Pressure gauge to check tire pressure'],
        componentLocation: 'Wheel Rim Outset'
      },
      {
        id: 'item-4-3',
        label: 'Rim',
        details: 'Not damaged, cracked, or bent; no welds other than factory.',
        physicalAction: 'Inspect rim circumference and wheel bead.',
        tutorialTitle: 'Wheel Rim',
        tutorialDescription: 'Not damaged, cracked, or bent; no welds other than factory.',
        pointsToInspect: ['Not damaged, cracked, or bent', 'No welds other than factory'],
        componentLocation: 'Steer Wheel Rim'
      },
      {
        id: 'item-4-4',
        label: 'Lug Nuts',
        details: 'No missing lug nuts, or studs, no rust trails or shiny threads, or elongated holes.',
        physicalAction: 'Touch multiple lug nuts and inspect for rust streaks or shiny metal.',
        critical: true,
        tutorialTitle: 'Lug Nuts & Studs',
        tutorialDescription: 'No missing lug nuts, or studs, no rust trails or shiny threads, or elongated holes.',
        pointsToInspect: ['No missing lug nuts, or studs', 'No rust trails or shiny threads', 'No elongated holes'],
        componentLocation: 'Steer Wheel Hub'
      },
      {
        id: 'item-4-5',
        label: 'Close & Latch Hood',
        details: 'Now close the hood and latch it.',
        physicalAction: 'Now close the hood and latch it.',
        critical: true,
        tutorialTitle: 'Physical Action: Close & Latch Hood',
        tutorialDescription: 'Now close the hood and latch it.',
        pointsToInspect: ['Now close the hood and latch it'],
        componentLocation: 'Exterior Hood Sides'
      }
    ]
  },
  {
    id: 'section-5',
    number: 'V',
    title: 'Side of Vehicle',
    subtitle: 'Mirrors, Marker Light, Fuel/DEF Tanks, Battery Box, and Frame',
    category: 'side',
    vehicleLocation: 'side',
    truckCoordinates: { x: 30, y: 45 },
    items: [
      {
        id: 'item-5-1',
        label: 'Mirrors & Brackets',
        details: 'Clean, not cracked/broken, securely mounted. No missing nuts or bolts.',
        physicalAction: 'Touch mirrors and mounting brackets.',
        tutorialTitle: 'Mirrors & Brackets',
        tutorialDescription: 'Clean, not cracked/broken, securely mounted. No missing nuts or bolts.',
        pointsToInspect: ['Clean, not cracked/broken', 'Securely mounted', 'No missing nuts or bolts'],
        componentLocation: 'Driver Cab Door'
      },
      {
        id: 'item-5-2',
        label: 'Signal & Marker Light',
        details: 'Not chipped, cracked or broken. Clean and of the correct color.',
        physicalAction: 'Touch side amber signal and marker light lens.',
        tutorialTitle: 'Signal & Marker Light',
        tutorialDescription: 'Not chipped, cracked or broken. Clean and of the correct color.',
        pointsToInspect: ['Not chipped, cracked or broken', 'Clean and of the correct color'],
        componentLocation: 'Side of Cab / Fairing'
      },
      {
        id: 'item-5-3',
        label: 'Fuel/DEF Tanks',
        details: 'Fuel tank and DEF tanks, securely mounted, not damaged, caps are secure, fuel and DEF lines and wires are not damaged, I see no fluid leaks.',
        physicalAction: 'Check mounting straps, caps, lines and wires on both fuel and DEF tanks.',
        critical: true,
        tutorialTitle: 'Fuel/DEF Tanks',
        tutorialDescription: 'Fuel tank and DEF tanks, securely mounted, not damaged, caps are secure, fuel and DEF lines and wires are not damaged, I see no fluid leaks.',
        pointsToInspect: ['Securely mounted, not damaged', 'Caps are secure', 'Fuel and DEF lines and wires not damaged', 'I see no fluid leaks'],
        componentLocation: 'Lower Frame Rail - Driver Side'
      },
      {
        id: 'item-5-4',
        label: 'Battery Box',
        details: 'Open box; batteries securely attached, cables not worn, no excessive corrosion. Close the box cover and confirm it is secure.',
        physicalAction: 'Open box; batteries securely attached, cables not worn, no excessive corrosion. Close the box cover and confirm it is secure.',
        critical: true,
        tutorialTitle: 'Battery Box',
        tutorialDescription: 'Open box; batteries securely attached, cables not worn, no excessive corrosion. Close the box cover and confirm it is secure.',
        pointsToInspect: ['Open box', 'Batteries securely attached', 'Cables not worn', 'No excessive corrosion', 'Close box cover and confirm secure'],
        componentLocation: 'Battery Compartment'
      },
      {
        id: 'item-5-5',
        label: 'Frame & Crossmembers',
        details: 'No holes, no illegal welds, no missing nuts or bolts or missing cross members.',
        physicalAction: 'Inspect frame rail and crossmembers along the chassis.',
        tutorialTitle: 'Frame & Crossmembers',
        tutorialDescription: 'No holes, no illegal welds, no missing nuts or bolts or missing cross members.',
        pointsToInspect: ['No holes, no illegal welds', 'No missing nuts or bolts', 'No missing cross members'],
        componentLocation: 'Tractor Chassis Rail'
      }
    ]
  },
  {
    id: 'section-6',
    number: 'VI',
    title: 'Coupling System',
    subtitle: 'Air & Electric Lines, Release Arm, 5th Wheel Skid Plate, Kingpin, Apron, Locking Jaws & Lights',
    category: 'coupling',
    vehicleLocation: 'coupling',
    truckCoordinates: { x: 30, y: 55 },
    criticalRule: 'The coupling connection is the most critical mechanical bond on the rig. Zero gap between apron and skid plate!',
    items: [
      {
        id: 'item-6-1',
        label: 'Air & Electric Lines',
        details: 'Securely mounted to the truck and the trailer. They are not cut, cracked, chaffed, taped or worn. I hear no air leaks. Air lines and electric lines are securely seated - not tangled, crimped, pinched or dragging on the catwalk.',
        physicalAction: 'Inspect gladhands, electrical plug, and line suspension above catwalk.',
        critical: true,
        tutorialTitle: 'Air & Electric Lines',
        tutorialDescription: 'Securely mounted to the truck and the trailer. They are not cut, cracked, chaffed, taped or worn. I hear no air leaks. Air lines and electric lines are securely seated - not tangled, crimped, pinched or dragging on the catwalk.',
        pointsToInspect: ['Securely mounted to truck and trailer', 'Not cut, cracked, chaffed, taped or worn', 'I hear no air leaks', 'Securely seated - not tangled, crimped, pinched or dragging on catwalk'],
        componentLocation: 'Between Cab and Trailer Nose'
      },
      {
        id: 'item-6-2',
        label: 'Release Arm',
        details: 'Securely mounted. No missing nuts or bolts. It is in the locked position.',
        physicalAction: 'Check fifth wheel release arm and handle position.',
        tutorialTitle: 'Release Arm',
        tutorialDescription: 'Securely mounted. No missing nuts or bolts. It is in the locked position.',
        pointsToInspect: ['Securely mounted', 'No missing nuts or bolts', 'It is in the locked position'],
        componentLocation: '5th Wheel Plate Side'
      },
      {
        id: 'item-6-3',
        label: '5th Wheel Skid Plate',
        details: 'Properly greased. **I see no gap between the trailer apron and the fifth wheel skid plate.** Securely mounted to the platform. If sliding 5th wheel, locking pins are in locked position.',
        spokenScript: 'I see no gap between the trailer apron and the fifth wheel skid plate.',
        physicalAction: 'Look horizontally between the trailer apron and fifth wheel skid plate.',
        critical: true,
        tutorialTitle: '5th Wheel Skid Plate & Gap',
        tutorialDescription: 'Properly greased. **I see no gap between the trailer apron and the fifth wheel skid plate.** Securely mounted to the platform. If sliding 5th wheel, locking pins are in locked position.',
        pointsToInspect: ['Properly greased', 'I see no gap between the trailer apron and fifth wheel skid plate', 'Securely mounted to platform', 'If sliding 5th wheel, locking pins in locked position'],
        componentLocation: '5th Wheel Assembly'
      },
      {
        id: 'item-6-4',
        label: 'Kingpin & Apron',
        details: 'Kingpin is not bent, damaged or worn; Apron is not cracked or broken.',
        physicalAction: 'Inspect kingpin shank and trailer apron underbody.',
        critical: true,
        tutorialTitle: 'Kingpin & Apron',
        tutorialDescription: 'Kingpin is not bent, damaged or worn; Apron is not cracked or broken.',
        pointsToInspect: ['Kingpin is not bent, damaged or worn', 'Apron is not cracked or broken'],
        componentLocation: 'Trailer Upper Coupler Underbelly'
      },
      {
        id: 'item-6-5',
        label: 'Locking Jaws',
        details: 'Not cracked, broken or damaged. Jaws are locked around kingpin shank; there is no play between jaws and kingpin.',
        physicalAction: 'Look into fifth wheel throat from behind.',
        critical: true,
        tutorialTitle: 'Locking Jaws',
        tutorialDescription: 'Not cracked, broken or damaged. Jaws are locked around kingpin shank; there is no play between jaws and kingpin.',
        pointsToInspect: ['Not cracked, broken or damaged', 'Jaws are locked around kingpin shank', 'There is no play between jaws and kingpin'],
        componentLocation: '5th Wheel Throat'
      },
      {
        id: 'item-6-6',
        label: 'Tractor Lights',
        details: 'Tractor taillights and reflectors, not chipped, cracked, broken or damaged, clean and of the correct color RED.',
        physicalAction: 'Touch tractor rear lights and reflectors.',
        tutorialTitle: 'Tractor Lights & Reflectors',
        tutorialDescription: 'Tractor taillights and reflectors, not chipped, cracked, broken or damaged, clean and of the correct color RED.',
        pointsToInspect: ['Not chipped, cracked, broken or damaged', 'Clean and of the correct color RED'],
        componentLocation: 'Rear of Tractor Axles'
      }
    ]
  },
  {
    id: 'section-7',
    number: 'VII',
    title: 'Trailer',
    subtitle: 'Trailer Structure, Landing Gear, Tandems, DOT Tape & Rear Lights',
    category: 'trailer',
    vehicleLocation: 'trailer_body',
    truckCoordinates: { x: 30, y: 72 },
    items: [
      {
        id: 'item-7-1',
        label: 'Trailer Structure',
        details: 'Trailer frame and crossmembers; Not damaged, no cracks, holes or broken welds. Trailer floor - No breaks or holes. No missing cross members.',
        physicalAction: 'Look down trailer frame, crossmembers, and floor underbody.',
        tutorialTitle: 'Trailer Structure & Floor',
        tutorialDescription: 'Trailer frame and crossmembers; Not damaged, no cracks, holes or broken welds. Trailer floor - No breaks or holes. No missing cross members.',
        pointsToInspect: ['Not damaged, no cracks, holes or broken welds', 'Trailer floor - No breaks or holes', 'No missing cross members'],
        componentLocation: 'Under Trailer Box'
      },
      {
        id: 'item-7-2',
        label: 'Landing Gear',
        details: 'The landing gear frame and landing gear pads are not cracked, broken or damaged. It is fully raised and the crank handle is secured.',
        spokenScript: 'The fifth wheel skid plate is positioned so that the landing gear clears the tractor frame when turning.',
        physicalAction: 'Check landing gear frame and pads, verify fully raised, crank handle secured, and check clearance from tractor frame.',
        critical: true,
        tutorialTitle: 'Landing Gear & Skid Plate Clearance',
        tutorialDescription: 'The landing gear frame and landing gear pads are not cracked, broken or damaged. It is fully raised and the crank handle is secured. Check clearance between the landing gear and tractor frame when turning.',
        pointsToInspect: ['Frame and pads not cracked, broken or damaged', 'Fully raised and crank handle is secured', 'The fifth wheel skid plate is positioned so that the landing gear clears the tractor frame when turning'],
        componentLocation: 'Trailer Forward Landing Legs'
      },
      {
        id: 'item-7-3',
        label: 'Trailer Lights & Tandems',
        details: 'Trailer clearance light, signal marker, marker lights and ABS light - not chipped, cracked, broken or damaged - clean and of the correct color.',
        spokenScript: 'Trailer clearance light, signal marker, marker lights, and ABS light: not chipped, cracked, broken or damaged, clean and of the correct color.',
        physicalAction: 'Point to clearance light, signal marker, marker lights, and yellow ABS light on trailer.',
        tutorialTitle: 'Trailer Lights & Tandems',
        tutorialDescription: 'Trailer clearance light, signal marker, marker lights and ABS light - not chipped, cracked, broken or damaged - clean and of the correct color.',
        pointsToInspect: ['Not chipped, cracked, broken or damaged', 'Clean and of the correct color'],
        componentLocation: 'Trailer Body & Left Fender'
      },
      {
        id: 'item-7-4',
        label: 'Sliding Tandems',
        details: 'Locking handle and pins are in the locked position.',
        spokenScript: 'My trailer sliding tandems are not bent, cracked, or broken; locking pins are fully engaged and extended, and the release handle/button is in the locked position.',
        physicalAction: 'Inspect tandem slider rails, pins, and locking handle/button.',
        critical: true,
        tutorialTitle: 'Sliding Tandems Script',
        tutorialDescription: 'Locking handle and pins are in the locked position.',
        pointsToInspect: ['Not bent, cracked, or broken', 'Locking pins are fully engaged and extended', 'Release handle/button is in the locked position'],
        componentLocation: 'Trailer Bogie / Rear Axles'
      },
      {
        id: 'item-7-5',
        label: 'DOT Tape',
        details: '(Rear of Trailer) DOT Tape is not missing or peeling and runs the length and width of the trailer.',
        physicalAction: 'Inspect red/white DOT reflective tape along sides and across rear width.',
        tutorialTitle: 'DOT Reflective Tape',
        tutorialDescription: '(Rear of Trailer) DOT Tape is not missing or peeling and runs the length and width of the trailer.',
        pointsToInspect: ['DOT Tape is not missing or peeling', 'Runs the length and width of the trailer'],
        componentLocation: 'Trailer Perimeter & Rear Bumper'
      },
      {
        id: 'item-7-6',
        label: 'Trailer Lights Rear',
        details: 'Clearance, ID, marker and signal lights are not chipped, cracked, broken or damaged, and they are clean and of the correct color of RED.',
        physicalAction: 'Touch rear clearance, ID, marker and signal lights.',
        tutorialTitle: 'Trailer Lights Rear',
        tutorialDescription: 'Clearance, ID, marker and signal lights are not chipped, cracked, broken or damaged, and they are clean and of the correct color of RED.',
        pointsToInspect: ['Clearance, ID, marker and signal lights', 'Not chipped, cracked, broken or damaged', 'Clean and of the correct color of RED'],
        componentLocation: 'Trailer Rear Doors & Bumper'
      }
    ]
  },
  {
    id: 'section-8',
    number: 'VIII',
    title: 'In-Cab Inspection',
    subtitle: 'Key Sequence, Safe Start, Air Build Up, Controls & Emergency Equipment',
    category: 'incab',
    vehicleLocation: 'cab',
    truckCoordinates: { x: 30, y: 35 },
    criticalRule: 'Enter and exit cab maintaining 3 points of contact at all times. Seatbelt must be worn whenever in the driver seat.',
    items: [
      {
        id: 'item-8-1',
        label: 'Key Sequence',
        details: 'Turn the key to your right, to the ON position so you have electrical power.',
        spokenScript: 'My ABS lights have both come on and off on the dash and the trailer and my DEF and REGEN lights are all functioning properly.',
        physicalAction: 'Turn the key to your right, to the ON position so you have electrical power. Pump the brake pedal a few times so you can hear your air governor cut off!',
        critical: true,
        tutorialTitle: 'Key Sequence & Electrical Power',
        tutorialDescription: 'Turn the key to your right, to the ON position so you have electrical power. PHYSICAL ACTION REQUIRED: Pump the brake pedal a few times so you can hear your air governor cut off!',
        pointsToInspect: ['Turn key to the right to ON position for electrical power', 'ABS lights have both come on and off on dash and trailer', 'DEF and REGEN lights are all functioning properly', 'Pump brake pedal a few times to drop pressure below cut-off before start'],
        componentLocation: 'Ignition Key & Instrument Cluster'
      },
      {
        id: 'item-8-2',
        label: 'Safe Start',
        details: 'Perform safe engine start.',
        spokenScript: 'Now I will Perform a Safe Start: My truck is in neutral, brakes are set.',
        physicalAction: 'Verify transmission is in neutral and parking brakes are set before cranking engine.',
        critical: true,
        tutorialTitle: 'Safe Start Procedure',
        tutorialDescription: 'Perform safe engine start. Say: "Now I will Perform a Safe Start: My truck is in neutral, brakes are set."',
        pointsToInspect: ['Perform safe engine start', 'My truck is in neutral, brakes are set'],
        componentLocation: 'Shifter, Brake Knobs & Ignition'
      },
      {
        id: 'item-8-3',
        label: 'Air Build Up',
        details: 'Monitor progress. Sit, listen, and wait for it to happen!!!!',
        spokenScript: 'I will allow my air to build to a SAFE OPERATING LEVEL, I will listen for my AIR GOVERNOR TO CUT OFF at appx. 120 to 140 PSI. My AIR GOVERNOR has CUT OFF at 120 to 140 on my Primary and 120 to 140 on my secondary.',
        physicalAction: 'Sit, listen, and wait for it to happen!!!!',
        critical: true,
        tutorialTitle: 'Air Build Up & Governor Cut Off',
        tutorialDescription: 'Monitor progress. PHYSICAL ACTION REQUIRED: Sit, listen, and wait for it to happen!!!!',
        pointsToInspect: ['Allow air to build to a SAFE OPERATING LEVEL', 'Listen for AIR GOVERNOR TO CUT OFF at appx. 120 to 140 PSI', 'Sit, listen, and wait for it to happen!!!!', 'My AIR GOVERNOR has CUT OFF at ________ on my Primary and ________ on my secondary'],
        componentLocation: 'Primary & Secondary Air Gauges'
      },
      {
        id: 'item-8-4',
        label: 'Horns, Visibility, Climate & Indicators',
        details: 'Check operational controls inside the cab.',
        spokenScript: 'My city and highway horns work properly. My windshield is clean, free of illegal stickers, and not cracked or damaged. My mirrors are clean and adjusted to me. My wiper arms and blades are secure, the rubber is not damaged, and the wipers and washer fluid function properly. My heater and defroster are functional and working properly. My left turn signal, right turn signal, high beam headlight, and four-way hazard dashboard indicators are all operational and functioning properly.',
        physicalAction: 'Test city horn, highway horn, check windshield and mirrors, run wipers and washer fluid, test heater and defroster, and verify left turn, right turn, high beam, and 4-way hazard dashboard indicators.',
        critical: true,
        tutorialTitle: 'In-Cab Operational Controls',
        tutorialDescription: 'Check operational controls inside the cab.',
        pointsToInspect: ['City and highway horns', 'Windshield and mirrors', 'Wiper arms/blades and washer fluid', 'Heater and defroster', 'Left, right, high beam, and 4-way hazard dashboard indicators'],
        componentLocation: 'Cab Controls & Dashboard'
      },
      {
        id: 'item-8-5',
        label: 'Emergency Equipment',
        details: 'The fire extinguisher is securely mounted and fully charged. Spare fuses are onboard, and I have three reflective triangles in the red box under the rear seat.',
        physicalAction: 'Point to the fire extinguisher, spare fuses, and red box with 3 reflective triangles.',
        critical: true,
        tutorialTitle: 'Emergency Equipment',
        tutorialDescription: 'The fire extinguisher is securely mounted and fully charged. Spare fuses are onboard, and I have three reflective triangles in the red box under the rear seat.',
        pointsToInspect: ['Fire extinguisher securely mounted and fully charged', 'Spare fuses are onboard', 'Three reflective triangles in the red box under the rear seat'],
        componentLocation: 'Under Rear Seat & Cab'
      }
    ]
  },
  {
    id: 'section-9',
    number: 'IX',
    title: 'Air Brake Tests (Critical Failure Zone)',
    subtitle: 'Applied Leak Test, Low Air Warning, Spring Brake Pop & Execution Procedures',
    category: 'airbrake',
    vehicleLocation: 'brakes',
    truckCoordinates: { x: 30, y: 35 },
    criticalRule: 'CRITICAL FAILURE ZONE: Messing up ANY step, sequence, or number in the Air Brake Test results in an AUTOMATIC INSTANT FAILURE of the entire CDL exam.',
    items: [
      {
        id: 'item-9-1',
        label: '1. Shutdown Setup',
        details: 'Key ON/Engine OFF. SCRIPT: "I am shutting off my engine and turning my key back to the ON position so that I have electrical power."',
        spokenScript: 'I am shutting off my engine and turning my key back to the ON position so that I have electrical power.',
        physicalAction: 'Shut off the engine and turn key back to the ON position so electrical power is restored.',
        critical: true,
        tutorialTitle: '1. Shutdown Setup',
        tutorialDescription: 'I am shutting off my engine and turning my key back to the ON position so that I have electrical power.',
        pointsToInspect: ['Shut off engine', 'Turn key back to ON position for electrical power'],
        componentLocation: 'Ignition Key'
      },
      {
        id: 'item-9-2',
        label: '2. Settle Air',
        details: 'PHYSICAL ACTION REQUIRED: Push both knobs in. SCRIPT: "I will release my brakes and allow the air to settle."',
        spokenScript: 'I will release my brakes and allow the air to settle.',
        physicalAction: 'Push both knobs in.',
        critical: true,
        tutorialTitle: '2. Settle Air',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Push both knobs in. SCRIPT TO SAY OUT LOUD: "I will release my brakes and allow the air to settle."',
        pointsToInspect: ['Push both knobs in', 'Allow air to settle'],
        componentLocation: 'Yellow & Red Dash Push-Pull Knobs'
      },
      {
        id: 'item-9-3',
        label: '3. Explain Test',
        details: 'SCRIPT: "Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds."',
        spokenScript: 'Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds.',
        critical: true,
        tutorialTitle: '3. Explain Test',
        tutorialDescription: 'SCRIPT TO SAY OUT LOUD: "Now I am going to apply pressure to my brake pedal, start a timer and I should lose no more than 4 PSI in 60 seconds."',
        pointsToInspect: ['Lose max 4 PSI in 60 seconds'],
        keySpecs: 'Lose max 4 PSI in 60s'
      },
      {
        id: 'item-9-4',
        label: '4. Execute Timer',
        details: 'PHYSICAL ACTION REQUIRED: Put your foot on the pedal FIRST then START your timer. While doing this, LOOK at your key and brake knobs to double check the key is turned to the right fully and the brake knobs are outstretched - but NOT touch them!',
        spokenScript: 'Foot on the pedal first, then start the timer. Maintain pressure for sixty seconds and verify the key is turned on and brake knobs are pushed in without touching them.',
        physicalAction: 'Put your foot on the pedal FIRST then START your timer. While doing this, LOOK at your key and brake knobs to double check the key is turned to the right fully and the brake knobs are outstretched - but NOT touch them!',
        critical: true,
        tutorialTitle: '4. Execute Timer',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Put your foot on the pedal FIRST then START your timer. While doing this, LOOK at your key and brake knobs to double check the key is turned to the right fully and the brake knobs are outstretched - but NOT touch them!',
        pointsToInspect: ['Foot on pedal FIRST then START timer', 'Look at key: turned to the right fully', 'Look at brake knobs: outstretched (pushed in) but NOT touch them!'],
        componentLocation: 'Service Brake Pedal, Key & Knobs'
      },
      {
        id: 'item-9-5',
        label: '5. Announce Result',
        details: 'SCRIPT TO SAY OUT LOUD (AFTER 60 SECONDS): "I did NOT lose more than 4 PSI in 60 Seconds."',
        spokenScript: 'I did NOT lose more than 4 PSI in 60 Seconds.',
        physicalAction: 'Maintain firm foot pressure on brake pedal until 60 seconds expire, then announce result.',
        critical: true,
        tutorialTitle: '5. Announce Result',
        tutorialDescription: 'SCRIPT TO SAY OUT LOUD (AFTER 60 SECONDS): "I did NOT lose more than 4 PSI in 60 Seconds."',
        pointsToInspect: ['I did NOT lose more than 4 PSI in 60 Seconds'],
        keySpecs: 'Lose max 4 PSI'
      },
      {
        id: 'item-9-6',
        label: '6. Low Air Alarm Test',
        details: 'PHYSICAL ACTION REQUIRED: Fan your brakes until the light and alarm cut on, then stop fanning. SCRIPT: "My low air alarm and light CUT ON at 60 PSI."',
        spokenScript: 'My low air alarm and light CUT ON at 60 PSI.',
        physicalAction: 'Fan your brakes until the light and alarm cut on, then stop fanning.',
        critical: true,
        tutorialTitle: '6. Low Air Alarm Test',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Fan your brakes until the light and alarm cut on, then stop fanning. SCRIPT TO SAY OUT LOUD: "My low air alarm and light CUT ON at ________ PSI."',
        pointsToInspect: ['Fan brakes until light and alarm cut on', 'Stop fanning immediately', 'Approx. 60 PSI requirement'],
        keySpecs: 'Approx. 60 PSI'
      },
      {
        id: 'item-9-7',
        label: '7. Spring Brake Test',
        details: 'SCRIPT: "Now I will continue to fan my brakes until my trailer and tractor brakes set which should happen at about 40/20 PSI." PHYSICAL ACTION REQUIRED: Fan until your brakes set (BOTH knobs pop out). SCRIPT: "My trailer brakes have set at 40 and my Tractor brakes have set at 20."',
        spokenScript: 'Now I will continue to fan my brakes until my trailer and tractor brakes set which should happen at about 40/20 PSI. My trailer brakes have set at 40 and my Tractor brakes have set at 20.',
        physicalAction: 'Fan until your brakes set (BOTH knobs pop out).',
        critical: true,
        tutorialTitle: '7. Spring Brake Test',
        tutorialDescription: 'Fan until your brakes set (BOTH knobs pop out). Announce: "My trailer brakes have set at ________ and my Tractor brakes have set at ________."',
        pointsToInspect: ['Fan until brakes set (BOTH knobs pop out)', 'Trailer and tractor brakes set at approx 40-20 PSI', 'Announce trailer and tractor pop pressures'],
        keySpecs: 'Knobs pop at approx. 40-20 PSI'
      },
      {
        id: 'item-9-8',
        label: '8. Re-Build Air Pressure',
        details: 'PHYSICAL ACTION REQUIRED: Perform a SAFE START (Truck in neutral and my brakes are set. Start the truck). SCRIPT: "Now I will allow my air pressure to build to approximately 60 PSI at which point my Low Air Alarm and Light should CUT OFF." SCRIPT: "My Low Air Alarm and Light have CUT OFF at 60."',
        spokenScript: 'Now I will allow my air pressure to build to approximately 60 PSI at which point my Low Air Alarm and Light should CUT OFF. My Low Air Alarm and Light have CUT OFF at 60.',
        physicalAction: 'Perform a SAFE START (Truck in neutral and my brakes are set. Start the truck).',
        critical: true,
        tutorialTitle: '8. Re-Build Air Pressure',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Perform a SAFE START (Truck in neutral and my brakes are set. Start the truck). Announce when alarm and light cut off.',
        pointsToInspect: ['Perform safe start (Truck in neutral, brakes set)', 'Air pressure builds to approximately 60 PSI', 'Low Air Alarm and Light CUT OFF'],
        componentLocation: 'Ignition, Shifter & Dash Cluster'
      },
      {
        id: 'item-9-9',
        label: '9. Air Governor Cut Off',
        details: 'PHYSICAL ACTION REQUIRED: Sit and wait for the governor system to cycle. SCRIPT: "My Air Governor has CUT OFF at 120 to 140 on my Primary and 120 to 140 on my secondary."',
        spokenScript: 'My Air Governor has CUT OFF at 120 to 140 on my Primary and 120 to 140 on my secondary.',
        physicalAction: 'Sit and wait for the governor system to cycle.',
        critical: true,
        tutorialTitle: '9. Air Governor Cut Off',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Sit and wait for the governor system to cycle. SCRIPT TO SAY OUT LOUD: "My Air Governor has CUT OFF at ________ on my Primary and ________ on my secondary."',
        pointsToInspect: ['Sit and wait for governor system to cycle', 'Air Governor cut off at 120 to 140 PSI', 'Announce Primary and Secondary readings'],
        keySpecs: 'Cut off at 120-140 PSI'
      },
      {
        id: 'item-9-10',
        label: '10. Chock Retrieval',
        details: 'PHYSICAL ACTION REQUIRED: Exit the cab using 3 points of contact and RETRIEVE your wheel chocks. Close the door when you get out and put them on the floor of the back seat. Reenter the cab using 3 points of contact and put your seat belt back on.',
        spokenScript: 'I will exit the cab using three points of contact, retrieve my wheel chocks, place them securely in the cab, re-enter using three points of contact, and fasten my seatbelt.',
        physicalAction: 'Exit the cab using 3 points of contact and RETRIEVE your wheel chocks. Close the door when you get out and put them on the floor of the back seat. Reenter the cab using 3 points of contact and put your seat belt back on.',
        critical: true,
        tutorialTitle: '10. Chock Retrieval',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Exit the cab using 3 points of contact and RETRIEVE your wheel chocks. Close the door when you get out and put them on the floor of the back seat. Reenter the cab using 3 points of contact and put your seat belt back on.',
        pointsToInspect: ['Exit cab using 3 points of contact', 'Retrieve wheel chocks and place on floor of back seat', 'Close door when exiting', 'Reenter cab using 3 points of contact', 'Put seat belt back on'],
        componentLocation: 'Cab Door, Ground Wheels & Seatbelt'
      }
    ]
  },
  {
    id: 'section-10',
    number: 'X',
    title: 'Final Brake Checks (Tug Test / Service Brake Test)',
    subtitle: 'Parking Brake, Trailer Brake, and Service Brake Test',
    category: 'final',
    vehicleLocation: 'brakes',
    truckCoordinates: { x: 30, y: 35 },
    items: [
      {
        id: 'item-10-1',
        label: 'Parking Brake',
        details: 'Pull yellow knob, push red. Tug twice in Drive.',
        spokenScript: 'Parking Brakes Hold.',
        physicalAction: 'Pull yellow knob, push red. Tug twice in Drive.',
        critical: true,
        tutorialTitle: 'Parking Brake Tug Check',
        tutorialDescription: 'Pull yellow knob, push red. Tug twice in Drive. SCRIPT TO SAY OUT LOUD: "Parking Brakes Hold."',
        pointsToInspect: ['Pull yellow knob, push red', 'Tug twice in Drive', 'Parking Brakes Hold'],
        componentLocation: 'Yellow Parking Knob'
      },
      {
        id: 'item-10-2',
        label: 'Trailer Brake',
        details: 'Pull red knob, push yellow. Tug twice in Drive.',
        spokenScript: 'Brakes held.',
        physicalAction: 'Pull red knob, push yellow. Tug twice in Drive.',
        critical: true,
        tutorialTitle: 'Trailer Brake Tug Check',
        tutorialDescription: 'Pull red knob, push yellow. Tug twice in Drive. SCRIPT TO SAY OUT LOUD: "Brakes held."',
        pointsToInspect: ['Pull red knob, push yellow', 'Tug twice in Drive', 'Brakes held'],
        componentLocation: 'Red Trailer Knob'
      },
      {
        id: 'item-10-3',
        label: 'Service Brake',
        details: 'Prepare for moving check. PHYSICAL ACTION REQUIRED: Push both knobs in, drive 5 mph and brake firmly.',
        spokenScript: 'Now I will perform a service brake test. I will release both my tractor and trailer brakes, allow the truck to accelerate to approx. 5 MPH and apply the brakes. Brakes should function properly and the truck should not PULL left or right. Brakes functioned properly, and the truck did not pull left or right.',
        physicalAction: 'Push both knobs in, drive 5 mph and brake firmly.',
        critical: true,
        tutorialTitle: 'Service Brake Test',
        tutorialDescription: 'Prepare for moving check. PHYSICAL ACTION REQUIRED: Push both knobs in, drive 5 mph and brake firmly.',
        pointsToInspect: ['Release tractor and trailer brakes', 'Accelerate to approx 5 MPH', 'Apply brakes firmly', 'Truck did not pull left or right'],
        componentLocation: 'Service Brake Pedal & Driveway'
      }
    ]
  },
  {
    id: 'section-11',
    number: 'XI',
    title: 'Exterior Light Check & Conclusion',
    subtitle: 'Shutdown Sequence, Examiner Request & Conclusion',
    category: 'final',
    vehicleLocation: 'front',
    truckCoordinates: { x: 50, y: 15 },
    items: [
      {
        id: 'item-11-1',
        label: 'Shutdown Sequence',
        details: 'Set your brakes. Put truck in neutral. Shut your engine OFF.',
        spokenScript: 'I am shutting my engine off and turning my key to the on position so that I have electrical power. I am checking to make sure my lights are on.',
        physicalAction: 'Set your brakes. Put truck in neutral. Shut your engine OFF. Turn key to ON position so you have electrical power. Turn on all lights and switches to prepare for the comprehensive light operation check.',
        critical: true,
        tutorialTitle: 'Shutdown Sequence & Light Power',
        tutorialDescription: 'Set your brakes. Put truck in neutral. Shut your engine OFF. SCRIPT TO SAY OUT LOUD: "I am shutting my engine off and turning my key to the on position so that I have electrical power. I am checking to make sure my lights are on."',
        pointsToInspect: ['Set your brakes', 'Put truck in neutral', 'Shut your engine OFF', 'Turn key to ON position', 'Check that lights are on'],
        componentLocation: 'Ignition & Light Switches'
      },
      {
        id: 'item-11-2',
        label: 'Examiner Request',
        details: 'Activate systems and request physical external assistance.',
        spokenScript: 'I have turned on all of my lights for the light operation check. Would you please assist me with my exterior light check?',
        physicalAction: 'Turn on all lights and switches to prepare for the comprehensive light operation check. Direct the examiner all the way around the truck covering ALL lights (Front, Sides, Rear).',
        critical: true,
        tutorialTitle: 'Examiner Light Check Request',
        tutorialDescription: 'PHYSICAL ACTION REQUIRED: Turn on all lights and switches to prepare for the comprehensive light operation check. SCRIPT TO SAY OUT LOUD: "I have turned on all of my lights for the light operation check. Would you please assist me with my exterior light check?" PHYSICAL ACTION REQUIRED: Direct the examiner all the way around the truck covering ALL lights (Front, Sides, Rear).',
        pointsToInspect: ['Turn on all lights and switches', 'Request examiner assistance out loud', 'Direct examiner covering Front, Sides, Rear lights'],
        componentLocation: 'Examiner Interaction'
      },
      {
        id: 'item-11-3',
        label: 'Conclusion',
        details: 'Official Pre-Trip and In-Cab completion.',
        spokenScript: 'This concludes my Pretrip and In-cab Inspection.',
        physicalAction: 'Present yourself to the examiner and state the official conclusion.',
        critical: true,
        tutorialTitle: 'Inspection Conclusion',
        tutorialDescription: 'SCRIPT TO SAY OUT LOUD: "This concludes my Pretrip and In-cab Inspection."',
        pointsToInspect: ['This concludes my Pretrip and In-cab Inspection.'],
        componentLocation: 'Exam Completion'
      }
    ]
  }
];

export const TOTAL_INSPECTION_ITEMS = INSPECTION_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
export const TOTAL_SCRIPT_ITEMS = INSPECTION_SECTIONS.reduce(
  (acc, sec) => acc + sec.items.filter(item => !!item.spokenScript).length,
  0
);

