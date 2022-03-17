/*
	Some notes regarding the style at play here. Remove this blurb before merge.

	- Simple true/false conditionals that involve the setting of a variable use ternary operators.
		I personally prefer using them, as they are shorter and neater.
		Peruse online Javascript documentation if you have trouble what exactly a ternary operator does.
		Essentially, this block of code;
			```
			var x = True ? 'Hello world!' : 'Goodbye world...';
			console.log(x); // Will print "Hello world!"
			```
		is *exactly* the same as:
			```
			var x;
			if (True) {
				x = 'Hello world!';
			} else {
				x = 'Goodbye world...';
			}
			```
	- Single quotes (') are used instead of double quotes (") where possible.
		Pure personal preference.
	- Listener addition lines that heavily use a consistent event pattern and involve similar elements
		were condensed into arrays of element "identifiers" and "forEach(x => ...)"
	- LINES PROPERLY END WITH SEMICOLONS (where it makes sense, and syntax-adherent,)BECAUSE NOT DOING SO
		IS THE FASTEST WAY TO CREATE INCONSISTENT JAVASCRIPT CODE
		https://www.trivialdiscourse.com/front-end%20development/2021/05/17/semicolons-in-javascript.html
		https://stackoverflow.com/questions/537632/should-i-use-semicolons-in-javascript
	- If a value was constantly reused (...so, the "positive/negative" background color styles),
		it was made a variable.
	- Rules for the wildcard comments sprinkled around;
		- *: Placeholder
		- [*]: Placeholder that specifies exactly how many characters it will be replaced with. One asterisk means one character.
			- Example: [**] is two characters, that can represent our array ['AA', 'BB', 'CC'].
		- [*?]: Placeholder that will be replaced with an unknown number of characters. Equivalent to the first case, and
			only really used for readability.
	- "Section" comments use exactly ten equal signs, five around both the beginning and end of the section name.
	- All comments adhere to loose English grammar where it makes sense (start with capital letter, end with a period/exclamation mark)
	- Unused variables should either not exist or be replaced with an underscore (_)
*/

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
	// ...
	powerCellCount: document.getElementById('powerCellCount'),
	isAltShot : document.getElementById('Is Alt Shot'),
	isReadyToShoot : document.getElementById('Is At Speed'),
	isSingulatorRunning : document.getElementById('Singulator'),
	isInfeedRunning : document.getElementById('Infeed'),
	isConveyorRunning : document.getElementById('Conveyor'),
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

NetworkTables.addKeyListener('/photonvision/C922_Pro_Stream_Webcam/targetPitch', (_, value) => {
	console.log(`/photonvision/C922_Pro_Stream_Webcam/targetPitch -> ${value}`);
	ui.targetRPM.textContent = value;
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

NetworkTables.addKeyListener('/SmartDashboard/Is At Speed', (_, value) => {
	// FOR REVIEW: What does "Is At Speed" actually refer to?
	// For the time being, I will use the terminology "at the needed speed".

	// Using a ternary operator, make the box green if we are at the needed speed, and red if not.
	ui.isReadyToShoot.style = value ? affirmativeStyle : negativeStyle;
	// Using a ternary operator, make the box read "Shoot" if we are at the needed speed, or "NOT READY." if not.
	ui.isReadyToShoot.textContent = value ? 'Shoot!' : 'NOT READY.';
});

NetworkTables.addKeyListener('/SmartDashboard/Shot Distance', (_, value) => {
	ui.shooterDist.textContent = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Cell Count', (_, value) => {
	ui.powerCellCount.textContent = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Shooter Offset', (_, value) => {
	ui.shooterOffset.textContent = value;
});

NetworkTables.addKeyListener('/SmartDashboard/Shooter Sensor Distance', (_, value) => {
	ui.shooterSensorDistance.textContent = value;
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
