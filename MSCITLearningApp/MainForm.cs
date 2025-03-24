using System;
using System.Windows.Forms;

namespace MSCITLearningApp
{
    public partial class MainForm : Form
    {
        public MainForm()
        {
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = "MSCIT Learning Platform";
            this.Size = new System.Drawing.Size(1200, 800);
            this.StartPosition = FormStartPosition.CenterScreen;

            // Create main menu
            MenuStrip mainMenu = new MenuStrip();
            ToolStripMenuItem fileMenu = new ToolStripMenuItem("File");
            ToolStripMenuItem coursesMenu = new ToolStripMenuItem("Courses");
            ToolStripMenuItem quizMenu = new ToolStripMenuItem("Quiz");
            ToolStripMenuItem progressMenu = new ToolStripMenuItem("Progress");
            ToolStripMenuItem helpMenu = new ToolStripMenuItem("Help");

            mainMenu.Items.AddRange(new ToolStripItem[] { fileMenu, coursesMenu, quizMenu, progressMenu, helpMenu });
            this.MainMenuStrip = mainMenu;
            this.Controls.Add(mainMenu);

            // Create main content panel
            Panel mainContent = new Panel();
            mainContent.Dock = DockStyle.Fill;
            mainContent.Padding = new Padding(10);
            this.Controls.Add(mainContent);

            // Add welcome label
            Label welcomeLabel = new Label();
            welcomeLabel.Text = "Welcome to MSCIT Learning Platform";
            welcomeLabel.Font = new System.Drawing.Font("Arial", 24, System.Drawing.FontStyle.Bold);
            welcomeLabel.AutoSize = true;
            welcomeLabel.Location = new System.Drawing.Point(50, 50);
            mainContent.Controls.Add(welcomeLabel);

            // Add course buttons
            string[] courses = { "Computer Fundamentals", "Operating System", "MS Office", "Internet & Web", "Programming" };
            int buttonY = 150;
            foreach (string course in courses)
            {
                Button courseButton = new Button();
                courseButton.Text = course;
                courseButton.Size = new System.Drawing.Size(200, 40);
                courseButton.Location = new System.Drawing.Point(50, buttonY);
                courseButton.Click += (s, e) => OpenCourse(course);
                mainContent.Controls.Add(courseButton);
                buttonY += 50;
            }
        }

        private void OpenCourse(string courseName)
        {
            CourseForm courseForm = new CourseForm(courseName);
            courseForm.ShowDialog();
        }
    }
} 