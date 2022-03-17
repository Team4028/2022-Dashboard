// Define UI elements.
let ui = {
	fmsDebugMsg: document.getElementById('fmsDebugMsg'),
	robotCodeBuild: document.getElementById('robotCodeBuild'),
	robotScanTime: document.getElementById('robotScanTime'),

	// Auton selectors.
	openChooserWindowBtn: document.getElementById('openChooserWindowBtn'),

	// Chassis.
	fl: document.getElementById('FL'),
	fr: document.getElementById('FR'),
	rl: document.getElementById('RL'),
	rr: document.getElementById('RR'),

	// Climber.
	climberStatus: document.getElementById('climber-status'),

	// Vision.
	visionTargetIndicator: document.getElementById('visionTargetIndicator'),
	visionAngle1Indicator: document.getElementById('visionAngle1Indicator'),
	visionConnectionIndicator: document.getElementById('visionConnectionIndicator'),
	visionDistanceIndicator: document.getElementById('visionDistanceIndicator'),

	// Camera.
	camera: document.getElementById('camera'),

	// Subsystem info.
	isSingulatorRunning : document.getElementById('Singulator'),
	isInfeedRunning : document.getElementById('Infeed'),
	isConveyorRunning : document.getElementById('Conveyor'),

    // Shooter.
	backRpm: document.getElementById('back-rpm'),
	frontRpm: document.getElementById('front-rpm'),
	kickerRpm: document.getElementById('kicker-rpm'),
	angle: document.getElementById('angle'),

	frontTarget: document.getElementById('front-target'),
	backTarget: document.getElementById('back-target'),
	kickerTarget: document.getElementById('kicker-target'),
	angleTarget: document.getElementById('angle-target'),

	shot: document.getElementById('shot'),
	shooterIndex: document.getElementById('index')
};

// Define reused styles.
const neutralStyle = 'background-color: #2B3A42';
const affirmativeStyle = 'background-color: green';
const negativeStyle = 'background-color: rgb(173, 9, 9)';

// Create key listeners.

// ===== Header =====
// `robotState` is in `connection.js`.

NetworkTables.addKeyListener('/SmartDashboard/FMS Debug Msg', (_, value) => {
    ui.fmsDebugMsg.value = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Robot Build', (_, value) => {
    ui.robotCodeBuild.value = value;
});


// ===== Auton mode =====

// Load the list of prewritten autonomous modes.
NetworkTables.addKeyListener('/SmartDashboard/Auton/options', (_, value) => {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to open chooser window =';

	clearAutonButtons();

    // Dynamically build list of auton options.
    for (let i = 0; i < value.length; i++) {
        addButton(value[i]);
	}

	selectedAuton.value = '** Not selected **';
});

NetworkTables.addKeyListener('/SmartDashboard/Auton/default', (_, value) => {
	setAutonDefault(value.toString());
	selectedAuton.value = value;
});

// ===== Auton starting side =====

NetworkTables.addKeyListener('/SmartDashboard/Side Start/options', (_, value) => {
	openChooserWindowBtn.disabled = false;
	openChooserWindowBtn.textContent = '= Click to Open Chooser Window =';

	clearAutonSideButtons();

    // Dynamically build list of auton options.
	for (let i = 0; i < value.length; i++) {
        addSideButton(value[i]);
    }

	selectedSide.value = '** Not selected **'
});

NetworkTables.addKeyListener('/SmartDashboard/Side Start/default', (_, value) => {
	setSideDefault(value.toString());
	selectedSide.value = value;
});


// ===== Vision =====

NetworkTables.addKeyListener('/SmartDashboard/Has Target', (_, value) => {
	ui.visionTargetIndicator.style = value ? affirmativeStyle : negativeStyle;
	ui.visionAngle1Indicator.style = value ? affirmativeStyle : negativeStyle;
	ui.visionConnectionIndicator.style = value ? affirmativeStyle : negativeStyle;
	ui.visionTargetIndicator.textContent = value ? 'Target acquired.' : 'Target not acquired.';
});

NetworkTables.addKeyListener('/SmartDashboard/Target X Offset', (_, value) => {
	ui.visionAngle1Indicator.textContent = Math.round(value * 100) / 100 + '\u00B0';
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:Angle2InDegrees', (_, value) => {
	ui.visionAngle2Indicator.textContent = value + '\u00B0';
});

NetworkTables.addKeyListener('/SmartDashboard/Limelight Distance', (_, value) => {
	if(value < 600 && value != 0) {
		ui.visionDistanceIndicator.textContent = (Math.round(value * 10) / 10) + 'ft';
		if (value <= 600) {
			ui.visionDistanceIndicator.style = affirmativeStyle;
		}
	} else {
		ui.visionDistanceIndicator.style = negativeStyle;
		ui.visionDistanceIndicator.textContent = 'NO';
	}
});

NetworkTables.addKeyListener('/SmartDashboard/Vision:IsPingable', (_, value) => {
	ui.visionConnectionIndicator.style = value ? neutralStyle : negativeStyle;
});


// ===== POWERCELL COUNT =====



// ===== Shooter =====

// NOTE: "Is At Speed" means that the actual shooter RPM is up to the target value.
// It's not necessary anymore, as we have 3 separate motors and may not even use PIDV.
// Remove later.
NetworkTables.addKeyListener('/SmartDashboard/Is At Speed', (_, value) => {
	// FOR REVIEW: What does "Is At Speed" actually refer to?
	// For the time being, I will use the terminology "at the needed speed".

	// Using a ternary operator, make the box green if we are at the needed speed, and red if not.
	ui.isReadyToShoot.style = value ? affirmativeStyle : negativeStyle;
	// Using a ternary operator, make the box read "Shoot" if we are at the needed speed, or "NOT READY." if not.
	ui.isReadyToShoot.textContent = value ? 'Shoot!' : 'NOT READY.';
});

NetworkTables.addKeyListener('/SmartDashboard/Angle', (_, value) => {
	ui.angle.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/Actuator Value', (_, value) => {
	ui.angleTarget.textContent = Math.round(value * 10) / 10;
});

NetworkTables.addKeyListener('/SmartDashboard/Shot', (_, value) => {
	ui.shot.textContent = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Shooter Index', (_, value) => {
	ui.shooterIndex.textContent = Math.round(value * 10) / 10;
});

// [*?] Motor RPM
// [*?] Motor RPM
['Front', 'Back', 'Kicker'].forEach(entry => {
	// FOR REVIEW: Confirm both keys are actually in use.
	NetworkTables.addKeyListener(`/SmartDashboard/${entry} Motor RPM`, (_, value) => {
		ui[`${entry.toLowerCase()}Rpm`].textContent = Math.round(value * 10) / 10;
	});

	NetworkTables.addKeyListener(`/SmartDashboard/Shot ${entry} RPM`, (_, value) => {
		ui[`${entry.toLowerCase()}Target`].textContent = Math.round(value * 10) / 10;
	});
});

// /SmartDashboard/*/Running
// /SmartDashboard/*/Vbus
['Singulator', 'Infeed', 'Conveyor'].forEach(entry => {
	NetworkTables.addKeyListener(`/SmartDashboard/${key}/Running`, (_, value) => {
		// Using a ternary operator, make the box green if running, and red if not.
		ui[`is${entry}Running`].style = value ? affirmativeStyle : negativeStyle;
	});

	NetworkTables.addKeyListener(`/SmartDashboard/${key}/Vbus`, (_, value) => {
		ui[`is${entry}Running`].textContent = value;
	});
});

// /SmartDashboard/[**] Angle
['FL', 'FR', 'RL', 'RR'].forEach(entry => {
	NetworkTables.addKeyListener(`/SmartDashboard/${entry} Angle`, (_, value) => {
		ui[entry.toLowerCase()].textContent = Math.round(value * 10) / 10;
	});
});


// ===== Miscellaneous =====

NetworkTables.addKeyListener('/SmartDashboard/CamSelection', (_, value) => {
	camera.setAttribute('src', value);
});

addEventListener('error', ev => {
    ipc.send('windowError', {
		mesg: ev.message,
		file: ev.filename,
		lineNumber: ev.lineno
	});
});
