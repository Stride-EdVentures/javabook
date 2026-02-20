document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".bd-sidenav a");
  navLinks.forEach(link => {
    const text = link.textContent.trim();
    
    // Add icon to links ending with "Visualizer"
    if (text.endsWith("Visualizer")) {
      link.innerHTML = '<i class="fas fa-pen-square fa-fw"></i> ' + text;
    }
    
    // Italicize "Lesson Gx:" prefix
    const lessonMatch = text.match(/^(Lesson [A-Z]\d+:)(.+)$/);
    if (lessonMatch) {
      link.innerHTML = '<em>' + lessonMatch[1] + '</em>' + lessonMatch[2];
    }
  });
});