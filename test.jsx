try {

  app.activeDocument.exportDocument(
      new File (activeDocument.fullName.fsName.replace('_', '_test_')),
      ExportType.SAVEFORWEB,
      new File ('C:/Program Files/Adobe/Adobe Photoshop CC 2015/Presets/Optimized Settings/PNG-8 128 Dithered.irs')
    );

} catch (e) {
    alert(e)
} finally {
    alert(activeDocument.fullName.fsName)
}
