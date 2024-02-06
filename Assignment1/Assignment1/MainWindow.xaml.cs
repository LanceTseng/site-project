using System;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Assignment1.Entities;

namespace Assignment1
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private User _user = new User();
        private UserResponseReport _response = new UserResponseReport();
        private QuestionLoad _questionLoad = new QuestionLoad();
        private Controllers _controllers = new Controllers();
        private DataTable _userResponseReport = new DataTable();

        public MainWindow()
        {
            InitializeComponent();
        }

        /// <summary>
        /// The begin of the program
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void Grid_Loaded(object sender, RoutedEventArgs e)
        {
            _userResponseReport = _controllers.CreateDataTable<UserResponseReport>();

            NewQuiz();

            UpdateMsgText("Welcome to the Quiz!!", Brushes.BlueViolet);
        }

        /// <summary>
        /// get a new question from question collections
        /// </summary>
        private void NewQuiz()
        {
            UpdateMsgText("", Brushes.Black);

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
            panelQuestion.Children.Clear();
            panelQuestion.Children.Add(_questionLoad.DisplayQuestion());
        }

        /// <summary>
        /// display option component
        /// </summary>
        private void DisplayOption()
        {
            panelOption.Children.Clear();
            panelOption.Children.Add(_questionLoad.DisplayOptions(_questionLoad.OptionsByQuestion));
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
            dtMiniUserRespReport.ItemsSource = _userResponseReport.DefaultView;
            dtMiniUserRespReport.Columns[0].Visibility = Visibility.Collapsed;
            dtMiniUserRespReport.Columns[1].Visibility = Visibility.Collapsed;
            dtMiniUserRespReport.Columns[3].Visibility = Visibility.Collapsed;
            dtMiniUserRespReport.Columns[4].Visibility = Visibility.Collapsed;
            dtMiniUserRespReport.Columns[5].Visibility = Visibility.Collapsed;
            dtMiniUserRespReport.IsReadOnly = true;
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
        private void btnSubmit_Click(object sender, RoutedEventArgs e)
        {
            UpdateMsgText("", Brushes.Black);

            if (!IsOptionSelected())
                return;

            if (IsSubmitted())
                return;

            var selectedOptionId = (decimal)_controllers.SelectedRadioButton().Tag;

            _questionLoad.GetSelectedOption(selectedOptionId);

            var isCorrect = _questionLoad.Question.CorrectOptionId == selectedOptionId;
            if (isCorrect)
            {
                _user.Correction();
                UpdateMsgText("Correct", Brushes.Green);
            }
            else
            {
                _user.Incorrection();
                UpdateMsgText("Incorrect", Brushes.Crimson);
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
        private void btnEndTest_Click(object sender, RoutedEventArgs e)
        {
            var quizCompleteMsg = (IsLastQuiz() && IsCompletedQuiz()) ? "" : "The quiz is not completed.";

            var msg = $"Your Score is {_user.CurrentScore}.{Environment.NewLine}{quizCompleteMsg}{Environment.NewLine}Do you want to leave?";
            if (MessageBox.Show(msg, "End Test?", MessageBoxButton.YesNo, MessageBoxImage.Information) ==
                MessageBoxResult.Yes)
                this.Close();
        }

        /// <summary>
        /// Next / Previous Button Event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnQuestionSequence_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                UpdateMsgText("", Brushes.Black);
                var selectedOptionId = (decimal)_controllers.SelectedRadioButton().Tag;

                var btn = (Button)sender;
                switch (btn.Tag.ToString())
                {
                    case "+":

                        if (!IsOptionSelected())
                            return;

                        if (IsLastQuiz())
                            return;

                        if (!IsSubmitted(false))
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
                UpdateMsgText(exception.ToString(), Brushes.DarkRed);
            }
        }

        /// <summary>
        /// Report Event
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private void btnReport_Click(object sender, RoutedEventArgs e)
        {
            var datagrid = new DataGrid();
            datagrid.ItemsSource = _userResponseReport.DefaultView;

            var stackPanel = new StackPanel { Orientation = Orientation.Vertical };
            stackPanel.Children.Add(datagrid);

            var window = new Window();
            window.Title = "Report";
            window.Content = "Report";
            window.Content = stackPanel;
            window.Show();
        }

        #endregion Btn event

        #region Status Update

        /// <summary>
        /// update msg text
        /// </summary>
        /// <param name="context">text</param>
        /// <param name="color">text color</param>
        private void UpdateMsgText(string context, Brush color)
        {
            this.txtMsg.Content = context;
            this.txtMsg.Foreground = color;
        }

        /// <summary>
        /// Update score and complete qty
        /// </summary>
        private void UpdateInformation()
        {
            lblScore.Content = $"Score: {_user.CurrentScore.ToString()}";
            lblQuestionQty.Content = $"Comp.Qty: {_user.CompleteQuestionCount} / {_questionLoad.QuestionQty}";
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
                UpdateMsgText("Please select an option.", Brushes.DarkRed);
                return false;
            }

            return true;
        }

        /// <summary>
        /// check if question has submitted
        /// </summary>
        /// <returns></returns>
        private bool IsSubmitted(bool showError = true)
        {
            var check = _user.IsCompleted(_user.CurrentQuestionId);

            if (showError)
                UpdateMsgText((check) ? "Duplicate submit." : "Please submit.", Brushes.DarkRed);

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
                UpdateMsgText("There is no previous question.", Brushes.DarkBlue);
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
                UpdateMsgText("There is no next question.", Brushes.DarkBlue);
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
                UpdateMsgText("Quiz Completed.", Brushes.DarkBlue);
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