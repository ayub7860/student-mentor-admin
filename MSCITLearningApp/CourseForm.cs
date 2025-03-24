using System;
using System.Windows.Forms;

namespace MSCITLearningApp
{
    public class CourseForm : Form
    {
        private string courseName;
        private TabControl tabControl;
        private WebBrowser contentBrowser;
        private ListBox topicsList;
        private Button startQuizButton;

        public CourseForm(string courseName)
        {
            this.courseName = courseName;
            InitializeComponent();
        }

        private void InitializeComponent()
        {
            this.Text = courseName;
            this.Size = new System.Drawing.Size(1000, 600);
            this.StartPosition = FormStartPosition.CenterScreen;

            // Create split container
            SplitContainer splitContainer = new SplitContainer();
            splitContainer.Dock = DockStyle.Fill;
            splitContainer.SplitterDistance = 250;
            this.Controls.Add(splitContainer);

            // Create topics list
            topicsList = new ListBox();
            topicsList.Dock = DockStyle.Fill;
            topicsList.SelectedIndexChanged += TopicsList_SelectedIndexChanged;
            splitContainer.Panel1.Controls.Add(topicsList);

            // Create content panel
            Panel contentPanel = new Panel();
            contentPanel.Dock = DockStyle.Fill;
            splitContainer.Panel2.Controls.Add(contentPanel);

            // Create tab control
            tabControl = new TabControl();
            tabControl.Dock = DockStyle.Fill;
            contentPanel.Controls.Add(tabControl);

            // Create content tab
            TabPage contentTab = new TabPage("Content");
            contentBrowser = new WebBrowser();
            contentBrowser.Dock = DockStyle.Fill;
            contentTab.Controls.Add(contentBrowser);
            tabControl.TabPages.Add(contentTab);

            // Create quiz tab
            TabPage quizTab = new TabPage("Quiz");
            startQuizButton = new Button();
            startQuizButton.Text = "Start Quiz";
            startQuizButton.Location = new System.Drawing.Point(20, 20);
            startQuizButton.Click += StartQuizButton_Click;
            quizTab.Controls.Add(startQuizButton);
            tabControl.TabPages.Add(quizTab);

            // Load topics
            LoadTopics();
        }

        private void LoadTopics()
        {
            // Add sample topics based on course
            switch (courseName)
            {
                case "Computer Fundamentals":
                    topicsList.Items.AddRange(new string[] {
                        "Introduction to Computers",
                        "Computer Hardware",
                        "Computer Software",
                        "Data Representation",
                        "Computer Networks"
                    });
                    break;
                case "Operating System":
                    topicsList.Items.AddRange(new string[] {
                        "Introduction to OS",
                        "Process Management",
                        "Memory Management",
                        "File Systems",
                        "Device Management"
                    });
                    break;
                // Add more cases for other courses
            }
        }

        private void TopicsList_SelectedIndexChanged(object sender, EventArgs e)
        {
            if (topicsList.SelectedItem != null)
            {
                string topic = topicsList.SelectedItem.ToString();
                // Load content for selected topic
                LoadTopicContent(topic);
            }
        }

        private void LoadTopicContent(string topic)
        {
            // In a real application, this would load content from a database or file
            string content = $"<html><body><h1>{topic}</h1><p>Content for {topic} will be displayed here.</p></body></html>";
            contentBrowser.DocumentText = content;
        }

        private void StartQuizButton_Click(object sender, EventArgs e)
        {
            if (topicsList.SelectedItem != null)
            {
                QuizForm quizForm = new QuizForm(courseName, topicsList.SelectedItem.ToString());
                quizForm.ShowDialog();
            }
            else
            {
                MessageBox.Show("Please select a topic first.", "Quiz", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }
    }
} 