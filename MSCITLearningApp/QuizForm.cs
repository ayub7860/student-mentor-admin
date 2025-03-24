using System;
using System.Collections.Generic;
using System.Windows.Forms;

namespace MSCITLearningApp
{
    public class QuizForm : Form
    {
        private string courseName;
        private string topic;
        private List<Question> questions;
        private int currentQuestionIndex = 0;
        private RadioButton[] answerButtons;
        private Label questionLabel;
        private Button nextButton;
        private Label scoreLabel;
        private int score = 0;

        public QuizForm(string courseName, string topic)
        {
            this.courseName = courseName;
            this.topic = topic;
            InitializeComponent();
            LoadQuestions();
        }

        private void InitializeComponent()
        {
            this.Text = $"Quiz - {topic}";
            this.Size = new System.Drawing.Size(800, 600);
            this.StartPosition = FormStartPosition.CenterScreen;

            // Create main panel
            Panel mainPanel = new Panel();
            mainPanel.Dock = DockStyle.Fill;
            mainPanel.Padding = new Padding(20);
            this.Controls.Add(mainPanel);

            // Create score label
            scoreLabel = new Label();
            scoreLabel.Text = "Score: 0";
            scoreLabel.AutoSize = true;
            scoreLabel.Location = new System.Drawing.Point(20, 20);
            mainPanel.Controls.Add(scoreLabel);

            // Create question label
            questionLabel = new Label();
            questionLabel.AutoSize = true;
            questionLabel.Location = new System.Drawing.Point(20, 60);
            questionLabel.Size = new System.Drawing.Size(700, 60);
            mainPanel.Controls.Add(questionLabel);

            // Create answer buttons panel
            Panel answersPanel = new Panel();
            answersPanel.Location = new System.Drawing.Point(20, 140);
            answersPanel.Size = new System.Drawing.Size(700, 300);
            mainPanel.Controls.Add(answersPanel);

            // Create answer buttons
            answerButtons = new RadioButton[4];
            for (int i = 0; i < 4; i++)
            {
                answerButtons[i] = new RadioButton();
                answerButtons[i].AutoSize = true;
                answerButtons[i].Location = new System.Drawing.Point(20, i * 40);
                answerButtons[i].Size = new System.Drawing.Size(600, 30);
                answersPanel.Controls.Add(answerButtons[i]);
            }

            // Create next button
            nextButton = new Button();
            nextButton.Text = "Next";
            nextButton.Location = new System.Drawing.Point(20, 460);
            nextButton.Click += NextButton_Click;
            mainPanel.Controls.Add(nextButton);
        }

        private void LoadQuestions()
        {
            // In a real application, this would load questions from a database
            questions = new List<Question>
            {
                new Question
                {
                    Text = "What is the basic unit of information in computing?",
                    Answers = new string[] { "Bit", "Byte", "Word", "Character" },
                    CorrectAnswerIndex = 0
                },
                new Question
                {
                    Text = "Which of the following is not an input device?",
                    Answers = new string[] { "Keyboard", "Mouse", "Printer", "Scanner" },
                    CorrectAnswerIndex = 2
                }
                // Add more questions based on the topic
            };

            DisplayCurrentQuestion();
        }

        private void DisplayCurrentQuestion()
        {
            if (currentQuestionIndex < questions.Count)
            {
                Question currentQuestion = questions[currentQuestionIndex];
                questionLabel.Text = $"Question {currentQuestionIndex + 1} of {questions.Count}:\n{currentQuestion.Text}";

                for (int i = 0; i < 4; i++)
                {
                    answerButtons[i].Text = currentQuestion.Answers[i];
                    answerButtons[i].Checked = false;
                }

                nextButton.Text = currentQuestionIndex == questions.Count - 1 ? "Finish" : "Next";
            }
            else
            {
                ShowResults();
            }
        }

        private void NextButton_Click(object sender, EventArgs e)
        {
            // Check if an answer is selected
            bool answerSelected = false;
            for (int i = 0; i < 4; i++)
            {
                if (answerButtons[i].Checked)
                {
                    answerSelected = true;
                    if (i == questions[currentQuestionIndex].CorrectAnswerIndex)
                    {
                        score++;
                        scoreLabel.Text = $"Score: {score}";
                    }
                    break;
                }
            }

            if (!answerSelected)
            {
                MessageBox.Show("Please select an answer.", "Quiz", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                return;
            }

            currentQuestionIndex++;
            DisplayCurrentQuestion();
        }

        private void ShowResults()
        {
            string message = $"Quiz completed!\nYour score: {score} out of {questions.Count}\n" +
                           $"Percentage: {(score * 100.0 / questions.Count):F1}%";
            
            MessageBox.Show(message, "Quiz Results", MessageBoxButtons.OK, MessageBoxIcon.Information);
            this.Close();
        }
    }

    public class Question
    {
        public string Text { get; set; }
        public string[] Answers { get; set; }
        public int CorrectAnswerIndex { get; set; }
    }
} 