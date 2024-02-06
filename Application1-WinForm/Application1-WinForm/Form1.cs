using System;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Windows.Forms;
using Application1_WinForm.Entities;
using NPOI.POIFS.NIO;

namespace Application1_WinForm
{
    public partial class Form1 : Form
    {
        private User _user = new User();
        private UserResponseReport _response = new UserResponseReport();
        private QuestionLoad _questionLoad = new QuestionLoad();
        private Controllers _controllers = new Controllers();
        private DataTable _userResponseReport = new DataTable();

        public Form1()
        {
            InitializeComponent();
            ComponentEventRegister();
        }

        /// <summary>
        /// Assign event to controllers
        /// </summary>
        private void ComponentEventRegister()
        {
            btnSubmit.Click += btnSubmit_Click;
            btnNext.Click += btnQuestionSequence_Click;
            btnPrevious.Click += btnQuestionSequence_Click;
            btnEndTest.Click += btnEndTest_Click;
            btnReport.Click += btnReport_Click;
            btnClearSelection.Click += btnClearSelectedOption_Click;
        }

        /// <summary>
        /// The begin of the program
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Form1_Load(object sender, EventArgs e)
        {
            _userResponseReport = _controllers.CreateDataTable<UserResponseReport>();

            NewQuiz();

            UpdateMsgText("Welcome to the Quiz!!", Color.BlueViolet);
        }

        /// <summary>
        /// get a new question from question collections
        /// </summary>
        private void NewQuiz()
        {
            UpdateMsgText("", Color.Black);

            //get random question
            _user.CurrentQuestionId = new QuestionSequence().GetQuestion();

            //check duplicate and get a question not display before
            if (IsDuplicateQuestion(_user.CurrentQuestionId))
            {
                for (int i = 1; i <= _questionLoad.Questions.Count; i++)
                {
                    if (!IsDuplicateQuestion(i))
                    {
                        _user.CurrentQuestionId = i;
                        break;
                    }
                }
            }

            //setup question and option
            UpdateQuestionAndOption();

            //UI display and control
            DisplayQuestion();
            DisplayOption();
            LockOption();
            UpdateInformation();
        }

        /// <summary>
        /// update the global resource
        /// </summary>
        private void UpdateQuestionAndOption()
        {
            _questionLoad.GetQuestion(_user.CurrentQuestionId);
            _questionLoad.GetOptions(_user.CurrentQuestionId);
            _questionLoad.UpdateDisplaySequence(_user.CurrentQuestionId);
        }

        #region Dispaly

        /// <summary>
        /// get UI component
        /// </summary>
        private void GetRadioButtonController()
        {
            _controllers = new Controllers();
            _controllers.SaveControlsToDic(panelOption);
        }

        /// <summary>
        /// display question component
        /// </summary>
        private void DisplayQuestion()
        {
            panelQuestion.Controls.Clear();
            panelQuestion.Controls.Add(_questionLoad.DisplayQuestion());
        }

        /// <summary>
        /// display option component
        /// </summary>
        private void DisplayOption()
        {
            panelOption.Controls.Clear();
            panelOption.Controls.Add(_questionLoad.DisplayOptions(_questionLoad.OptionsByQuestion));
            GetRadioButtonController();
        }

        /// <summary>
        /// display user response
        /// </summary>
        private void DisplayUserResponse()
        {
            if (!_user.IsCompleted(_user.CurrentQuestionId))
                return;

            var userResponse = _questionLoad.UserResponses.FirstOrDefault(x => x.QuestionId == _user.CurrentQuestionId);

            _controllers.RadioButtonCheck((decimal)userResponse.UserSelectOptionId);
        }

        /// <summary>
        /// display response mini report
        /// </summary>
        private void DisplayMiniUserResponseReport()
        {
            try
            {
                dgvReportMini.DataSource = _userResponseReport;
                dgvReportMini.ReadOnly = true;
                dgvReportMini.DefaultCellStyle.Font = new Font("Calibri", 12);


                foreach (var i in _response.HiddenColIndex)
                {
                    _controllers.SettingVisibleCol(dgvReportMini, i, false);
                }

                HighlightIncorrectQuestionInReport(dgvReportMini);

                dgvReportMini.CurrentCell = dgvReportMini.Rows[dgvReportMini.Rows.Count - 1].Cells[2];
            }
            catch (Exception e)
            {
                UpdateMsgText(e.Message, Color.Brown);
            }
        }

        private void HighlightIncorrectQuestionInReport(DataGridView view)
        {
            foreach (DataGridViewRow row in view.Rows)
            {
                if (!row.Cells[nameof(_response.IsCorrect)].Value.ToString().Equals("X"))
                    continue;

                _controllers.SettingColor(view, Color.Plum, row.Index);
            }

        }

        /// <summary>
        /// disable radio button
        /// </summary>
        private void LockOption()
        {
            _controllers.LockRadioButton(_user.IsCompleted(_user.CurrentQuestionId));
        }

        #endregion Dispaly

        #region Btn event

        /// <summary>
        /// submit event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnSubmit_Click(object sender, EventArgs e)
        {
            UpdateMsgText("", Color.Black);

            if (!IsOptionSelected())
                return;

            if (IsDuplicateSubmitted())
                return;

            var selectedOptionId = (decimal)_controllers.SelectedRadioButton().Tag;

            _questionLoad.GetSelectedOption(selectedOptionId);

            var isCorrect = _questionLoad.Question.CorrectOptionId == selectedOptionId;
            if (isCorrect)
            {
                _user.Correction();
                UpdateMsgText("Correct", Color.Green);
            }
            else
            {
                _user.Incorrection();
                UpdateMsgText("Incorrect", Color.Crimson);
            }

            _response = new UserResponseReport()
            {
                UserId = _user.UserId,
                QuestionId = _user.CurrentQuestionId,
                QuestionSequence = _questionLoad.GetDisplaySequence(),
                QuestionContext = _questionLoad.Question.QuestionContext,
                UserSelectOptionId = _questionLoad.Option.OptionId,
                UserSelectOptionSequence = _questionLoad.Option.Sequence,
                UserSelectOptionContext = _questionLoad.Option.OptionContext,
                IsCorrect = (isCorrect) ? "O" : "X"
            };
            _questionLoad.UserResponses.Add(_response);

            UpdateInformation();
            UpdateUseResponseReport();
            DisplayMiniUserResponseReport();
            LockOption();
        }

        /// <summary>
        /// End Test Event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnEndTest_Click(object sender, EventArgs e)
        {
            var quizCompleteMsg = (IsCompletedQuiz()) ? "" : "The quiz is not completed.";

            var msg = $"Your Score is {_user.CurrentScore}.{Environment.NewLine}{quizCompleteMsg}{Environment.NewLine}Do you want to leave?";
            if (MessageBox.Show(msg, "End Test?", MessageBoxButtons.YesNo, MessageBoxIcon.Information) ==
                DialogResult.Yes)
                this.Close();
        }

        /// <summary>
        /// Next / Previous Button Event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnQuestionSequence_Click(object sender, EventArgs e)
        {
            try
            {
                UpdateMsgText("", Color.Black);
                var selectedOptionId = (decimal)_controllers.SelectedRadioButton().Tag;

                var btn = (Button)sender;
                switch (btn.Tag.ToString())
                {
                    case "+":

                        if (!IsOptionSelected())
                            return;

                        if (IsLastQuiz())
                            return;

                        if (!IsSubmitted())
                            return;

                        _user.CurrentQuestionId = _questionLoad.GetNextQuestionId();
                        if (IsNewQuestion())
                        {
                            NewQuiz();
                            return;
                        }

                        break;

                    case "-":

                        if (IsFirstQuiz())
                            return;

                        _user.CurrentQuestionId = _questionLoad.GetPreviousQuestionId();

                        break;
                }

                UpdateQuestionAndOption();

                DisplayQuestion();
                DisplayOption();
                DisplayUserResponse();
                LockOption();
            }
            catch (Exception exception)
            {
                UpdateMsgText(exception.ToString(), Color.DarkRed);
            }
        }

        /// <summary>
        /// Report Event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnReport_Click(object sender, EventArgs e)
        {
            var dgvReport = new DataGridView()
            {
                DataSource = _userResponseReport,
                Dock = DockStyle.Fill,
                AllowUserToAddRows = false,
                DefaultCellStyle = new DataGridViewCellStyle()
                {
                    Font = new Font("Calibri", 11)
                },

            };
            HighlightIncorrectQuestionInReport(dgvReport);

            var form = new Form()
            {
                Text = "Report",
                Size = new Size(900, 600)
            };
            form.Controls.Add(dgvReport);
            form.ShowDialog();
        }

        private void btnClearSelectedOption_Click(object sender, EventArgs e)
        {

            if (IsSubmitted())
            {
                UpdateMsgText("Not allow to clean.", Color.DarkRed);
                return;
            }
            UpdateMsgText("", Color.DarkRed);

            DisplayOption();
        }

        #endregion Btn event

        #region Status Update

        /// <summary>
        /// update msg text
        /// </summary>
        /// <param name="context">text</param>
        /// <param name="color">text color</param>
        private void UpdateMsgText(string context, Color color)
        {
            this.lblMsg.Text = context;
            this.lblMsg.ForeColor = color;
        }

        /// <summary>
        /// Update score and complete qty
        /// </summary>
        private void UpdateInformation()
        {
            lblScore.Text = $"Score: {_user.CurrentScore.ToString()}";
            lblQuestionQty.Text = $"Comp.Qty: {_user.CompleteQuestionCount} / {_questionLoad.QuestionQty}";
        }

        /// <summary>
        /// update the record report
        /// </summary>
        private void UpdateUseResponseReport()
        {
            var row = _userResponseReport.NewRow();

            foreach (PropertyInfo prop in _response.GetType().GetProperties())
            {
                var v = prop.GetValue(_response, null).ToString();
                row[prop.Name] = v;
            }

            _userResponseReport.Rows.Add(row);
        }

        #endregion Status Update

        #region funtion check

        /// <summary>
        /// check if question duplicate
        /// </summary>
        /// <param name="questionId"></param>
        /// <returns></returns>
        private bool IsDuplicateQuestion(int questionId)
        {
            return _questionLoad.QuestionDisplaySequence.Exists(x => x == questionId);
        }

        /// <summary>
        /// check if option selected
        /// </summary>
        /// <returns></returns>
        private bool IsOptionSelected()
        {
            var selectedOptionId = (decimal)_controllers.SelectedRadioButton().Tag;
            if (selectedOptionId.Equals(0))
            {
                UpdateMsgText("Please select an option.", Color.DarkRed);
                return false;
            }

            return true;
        }

        /// <summary>
        /// check if question has submitted
        /// </summary>
        /// <returns></returns>
        private bool IsDuplicateSubmitted()
        {
            var check = _user.IsCompleted(_user.CurrentQuestionId);

            UpdateMsgText((check) ? "Duplicate submit." : "", Color.DarkRed);

            return check;
        }

        private bool IsSubmitted()
        {
            var check = _user.IsCompleted(_user.CurrentQuestionId);

            UpdateMsgText((check) ? "" : "Please submit.", Color.DarkRed);

            return check;

        }

        /// <summary>
        /// check if question is first
        /// </summary>
        /// <returns></returns>
        private bool IsFirstQuiz()
        {
            if (_questionLoad.GetDisplaySequence() == 1)
            {
                UpdateMsgText("There is no previous question.", Color.DarkBlue);
                return true;
            }

            return false;
        }

        /// <summary>
        /// check if question is last
        /// </summary>
        /// <returns></returns>
        private bool IsLastQuiz()
        {
            if (_questionLoad.GetDisplaySequence() == _questionLoad.QuestionQty)
            {
                UpdateMsgText("There is no next question.", Color.DarkBlue);
                return true;
            }

            return false;
        }

        /// <summary>
        /// check if all questions has completed
        /// </summary>
        /// <returns></returns>
        private bool IsCompletedQuiz()
        {
            if (_user.CompleteQuestionCount == _questionLoad.QuestionQty)
            {
                UpdateMsgText("Quiz Completed.", Color.DarkBlue);
                return true;
            }

            return false;
        }

        /// <summary>
        /// check if show next question
        /// </summary>
        /// <returns></returns>
        private bool IsNewQuestion()
        {
            return _user.CurrentQuestionId == -1;
        }

        #endregion funtion check

    }
}