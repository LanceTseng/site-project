using Assignment1.Attributes;

namespace Assignment1.Entities
{
    public class UserResponseReport
    {
        public decimal UserId { get; set; }

        public decimal QuestionId { get; set; }

        [ColumnAttr(HeaderText = "Ques.")]
        public decimal QuestionSequence { get; set; }

        public string QuestionContext { get; set; }

        public decimal UserSelectOptionId { get; set; }
        [ColumnAttr(HeaderText = "Option")]
        public decimal UserSelectOptionSequence { get; set; }

        public string UserSelectOptionContext { get; set; }

        [ColumnAttr(HeaderText = "Correction")]
        public string IsCorrect { get; set; }
    }
}