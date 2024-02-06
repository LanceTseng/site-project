using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using Assignment1.Entities;

namespace Assignment1
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
            label.Content = new TextBlock()
            {
                Text = $"Q{GetDisplaySequence()}. {Question.QuestionContext}",
                TextWrapping = TextWrapping.Wrap
            };

            label.FontSize = 25;

            return label;
        }

        /// <summary>
        /// create a container and options' radiobutton
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public StackPanel DisplayOptions(List<Option> options)
        {
            var panel = new StackPanel();
            panel.Name = "groupOptions";

            foreach (var option in options)
            {
                var rbOption = new RadioButton();
                rbOption.GroupName = "option";
                rbOption.Name = $"rbOption{option.Sequence.ToString()}";
                rbOption.Tag = option.OptionId;
                rbOption.Content = option.OptionContext;
                rbOption.FontSize = 25;
                panel.Children.Add(rbOption);
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