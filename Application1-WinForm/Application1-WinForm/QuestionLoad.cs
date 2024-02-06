using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using Application1_WinForm.Entities;

namespace Application1_WinForm
{
    public class QuestionLoad
    {
        private string fileName = "mcq.xlsx";

        public int QuestionQty { get; set; }

        public Question Question { get; set; }

        public List<Question> Questions { get; set; }

        public Option Option { get; set; }

        public List<Option> Options { get; set; }

        public List<Option> OptionsByQuestion { get; set; }

        /// <summary>
        /// Load question collection from excel by NPOI
        /// </summary>
        /// <returns></returns>
        public List<Question> LoadQuestion()
        {
            var file = new NpoiReader();
            var filePath = Path.Combine(fileName);
            return file.ReadExcelFile<Question>(filePath);
        }

        /// <summary>
        /// Load option collection from excel by NPOI
        /// </summary>
        /// <returns></returns>
        public List<Option> LoadOption()
        {
            var file = new NpoiReader();
            var filePath = Path.Combine(fileName);
            return file.ReadExcelFile<Option>(filePath, 1);
        }

        public List<UserResponseReport> UserResponses { get; set; }

        public List<int> QuestionDisplaySequence;

        public QuestionLoad()
        {
            Questions = LoadQuestion();
            Options = LoadOption();
            QuestionQty = 30;
            QuestionDisplaySequence = new List<int>();
            UserResponses = new List<UserResponseReport>();
        }

        /// <summary>
        /// set question
        /// </summary>
        /// <param name="questionId"></param>
        public void GetQuestion(int questionId)
        {
            Question = Questions.FirstOrDefault(x => x.QuestionId == questionId);
        }

        /// <summary>
        /// set option
        /// </summary>
        /// <param name="questionId"></param>
        public void GetOptions(int questionId)
        {
            OptionsByQuestion = Options.Where(x => x.QuestionId == questionId).ToList();
        }

        /// <summary>
        /// create question label component
        /// </summary>
        /// <returns></returns>
        public Label DisplayQuestion()
        {
            var label = new Label();
            label.Text = $"Q{GetDisplaySequence()}. {Question.QuestionContext}";
            label.Font = new Font("Calibri", 25F, FontStyle.Bold, GraphicsUnit.Point, (byte)(0));
            label.Dock = DockStyle.Fill;
            label.TextAlign = ContentAlignment.TopLeft;
            return label;
        }

        /// <summary>
        /// create a container and options' radiobutton
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public Panel DisplayOptions(List<Option> options)
        {
            var panel = new TableLayoutPanel()
            {
                Name = "groupOptions",
                Dock = DockStyle.Fill
            };

            foreach (var option in options)
            {
                var rbOption = new RadioButton()
                {
                    Name = $"rbOption{option.Sequence.ToString()}",
                    Tag = option.OptionId,
                    Text = option.OptionContext,
                    Font = new Font("Calibri", 25F, FontStyle.Regular, GraphicsUnit.Point, (byte)(0)),
                    Dock = DockStyle.Fill
                };
                panel.RowStyles.Add(new RowStyle(SizeType.Absolute, 80F));
                panel.Controls.Add(rbOption);
                
            }

            return panel;
        }

        /// <summary>
        /// insert question id to displayed list
        /// </summary>
        /// <param name="questionId"></param>
        public void UpdateDisplaySequence(int questionId)
        {
            if (QuestionDisplaySequence.Exists(x => x == questionId))
                return;

            QuestionDisplaySequence.Add(questionId);
        }

        /// <summary>
        /// get selected option id
        /// </summary>
        /// <param name="optionId"></param>
        public void GetSelectedOption(decimal optionId)
        {
            Option = Options.FirstOrDefault(x => x.OptionId == optionId);
        }

        /// <summary>
        /// get current question sequence
        /// </summary>
        /// <returns></returns>
        public int GetDisplaySequence()
        {
            return QuestionDisplaySequence.IndexOf((int)Question.QuestionId) + 1;
        }

        /// <summary>
        /// get previous question id which has displayed
        /// </summary>
        /// <returns></returns>
        public int GetPreviousQuestionId()
        {
            var currentQuestionSequence = QuestionDisplaySequence.IndexOf((int)Question.QuestionId);

            if (currentQuestionSequence == 0)
                return QuestionDisplaySequence[0];

            return QuestionDisplaySequence[currentQuestionSequence - 1];
        }

        /// <summary>
        /// get next question id which has displayed
        /// </summary>
        /// <returns></returns>
        public int GetNextQuestionId()
        {
            var currentQuestionSequence = QuestionDisplaySequence.IndexOf((int)Question.QuestionId);

            if (currentQuestionSequence + 1 > QuestionQty - 1)
                return QuestionDisplaySequence[currentQuestionSequence];

            if (currentQuestionSequence + 1 >= QuestionDisplaySequence.Count)
                return -1;

            return QuestionDisplaySequence[currentQuestionSequence + 1];
        }
    }
}