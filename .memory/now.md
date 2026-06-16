# Current Focus

Fixed bench issues: IoNavigator bench used opt* menu IDs vs view* element IDs (opt5 warning). mountSteadyElement now clears steady container before mount to prevent DOM accumulation / browser OOM during full bench runs.
