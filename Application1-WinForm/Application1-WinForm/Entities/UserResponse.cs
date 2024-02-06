using Assignment1.Attributes;

namespace Application1_WinForm.Entities
{
    public class UserResponseReport
    {
        public int[] HiddenColIndex = new int[] { 0, 1, 3, 4, 5 };

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