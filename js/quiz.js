// الانتظار لحين تحميل عناصر الصفحة
document.addEventListener('DOMContentLoaded', function () {
    const careerForm = document.getElementById('careerForm');
    const resultsContainer = document.getElementById('results');
    const recommendationsOutput = document.getElementById('recommendationsOutput');

    // عند الضغط على زرار "عرض التوصيات"
    careerForm.addEventListener('submit', function (e) {
        e.preventDefault(); // منع إعادة تحميل الصفحة

        // قراءة البيانات من الفورم
        const name = document.getElementById('fullName').value;
        const governorate = document.getElementById('governorate').value;
        const workEnv = document.getElementById('workEnv').value;
        const jobType = document.getElementById('jobType').value;
        const interest = document.getElementById('interest').value;

        // توليد التوصيات بناءً على المدخلات
        let recommendationHTML = generateRecommendations(name, governorate, workEnv, jobType, interest);

        // عرض النتيجة في الصفحة
        recommendationsOutput.innerHTML = recommendationHTML;
        resultsContainer.style.display = 'block';

        // التمرير السلس لنزول الشاشة عند النتيجة
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    });
});

// دالة تحليل البيانات وتوليد التوصيات المخصصة
function generateRecommendations(name, governorate, workEnv, jobType, interest) {
    let interestTitle = "";
    let courses = [];

    if (interest === 'ui-ux') {
        interestTitle = "تصميم واجهات وتجربة المستخدم (UI/UX Design)";
        courses = [
            "كورس Google UI/UX Professional Certificate (على Coursera)",
            "دورة أساسيات تصميم الواجهات بـ Figma على يوتيوب",
            "كورس UX Design Foundations من Interaction Design Foundation",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtube.com/playlist?list=PL-WVrM0m80DiwYy-AMIWaodyDGCvrSvqH&si=DmjOdZdQ-xmoJOFw" target="_blank" style="color: #ff0000; text-decoration: underline;">اضغط هنا لمشاهدة دورة UI/UX الكاملة</a>'
        ];
    } else if (interest === 'programming') {
        interestTitle = "تطوير البرمجيات والويب (Software Development)";
        courses = [
            "مسار JavaScript & Frontend Development (FreeCodeCamp)",
            "دورة بناء وتطوير المواقع الكاملة Full-Stack",
            "أساسيات البرمجيات وقواعد البيانات من CS50",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtu.be/ij6qQQlGKtE?si=S1keYJYLezkr9uF2" target="_blank" style="color: #ff0000; font-weight: bold; text-decoration: underline;">البداية مع بايثون.</a>'
        ];
    } else if (interest === 'graphic') {
        interestTitle = "التصميم الجرافيكي والهوية البصرية (Graphic Design)";
        courses = [
            "أساسيات الفوتوشوب والـ Illustrator للمبتدئين",
            "كورس بناء الهوية البصرية وشعارات الشركات",
            "تعلم تصميم إعلانات السوشيال ميديا الاحترافية",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtube.com/playlist?list=PLs-hceiryD_gbo46gGM7Gz3yJVAHu-CP7&si=3pI0uAFDJjqr964c" target="_blank" style="color: #ff0000; text-decoration: underline;">اضغط هنا لمشاهدة دورة الجرافيك الكاملة</a>'
        ];
    } else if (interest === 'qa') {
        interestTitle = "اختبار وجودة البرمجيات (Software QA Manual Testing)";
        courses = [
            "أساسيات Software Testing و ISTQB Foundation Level",
            "دورة كتابة Test Cases وتتبع الأخطاء (Bugs)",
            "تطبيقات عمل على اختبار واجهات المستخدم والمواقع",
            '🎬 <strong>ننصحك بمشاهدة هذا المحتوى:</strong> <a href="https://youtube.com/playlist?list=PLQUxWr2rTswl1D4f8Tkw3RvCD-ZB6LpgJ&si=jETL9o8mlNTrBHA9" target="_blank" style="color: #ff0000; text-decoration: underline;">اضغط هنا لمشاهدة دورة الـ QA الكاملة</a>'
        ];
    } else {
        interestTitle = "المجال المختار";
        courses = ["دورة أساسيات المجال المختار"];
    }

    let platforms = [];
    let tips = "";

    if (workEnv === 'remote' || jobType === 'freelance') {
        platforms = ["مستقل (Mostaql)", "خمسات (Khamsat)", "Upwork", "Behance (لعرض أعمالك)"];
        tips = `بما إنك تفضل العمل الحر/عن بُعد، ركز جداً على بناء بورتفوليو (Portfolio) قوي يعرض مشاريعك حتى لو كانت مشاريع تدريبية، وسجل في منصات الفريلانس ببروفايل احترافي.`;
    } else {
        platforms = ["LinkedIn Jobs", "Wuzzuf (وظف)", "Forasna (فرصنا)", "التوظيف المباشر للشركات"];
        tips = `احرص على تحسين حسابك على LinkedIn بما إنك تفضل العمل من مقر الشركة في ${governorate}.`;
    }

    return `
        <div style="line-height: 1.8;">
            <p><strong>أهلاً بك يا ${name} 👋</strong></p>
            <p>بناءً على اهتمامك بمجال <strong>${interestTitle}</strong> ورغبتك في نمط عمل (دوام كامل)، إليك التوصيات:</p>
            <hr style="margin: 1rem 0; border: 0; border-top: 1px solid #cbd5e1;">
            
            <h4 style="color: #1e40af; margin-bottom: 0.5rem;">📚 الكورسات والمسارات الموصى بها لك:</h4>
            <ul>
                ${courses.map(course => `<li>${course}</li>`).join('')}
            </ul>

            <h4 style="color: #1e40af; margin: 1rem 0 0.5rem 0;">💼 أفضل المنصات للبحث عن فرص مناسبة لظروفك:</h4>
            <ul>
                ${platforms.map(platform => `<li>${platform}</li>`).join('')}
            </ul>

            <h4 style="color: #1e40af; margin: 1rem 0 0.5rem 0;">💡 نصيحة مسارك الذهبية:</h4>
            <p style="background: #ffffff; padding: 0.8rem; border-right: 4px solid #2563eb; border-radius: 4px;">${tips}</p>
        </div>
    `;
}



(() => {
    const FIELD_ORDER = ['programming', 'uiux', 'graphic'];
    const FIELD_NAMES = {
        programming: 'البرمجة وتطوير الويب',
        uiux: 'تصميم UI/UX',
        graphic: 'التصميم الجرافيكي'
    };

    function calculateResult(questions, answers) {
        const scores = Object.fromEntries(FIELD_ORDER.map(field => [field, 0]));
        questions.forEach((question, index) => {
            const option = question.options[answers[index]];
            if (option && Object.hasOwn(scores, option.field)) scores[option.field] += option.weight;
        });
        const highest = Math.max(...Object.values(scores));
        const tied = FIELD_ORDER.filter(field => scores[field] === highest);
        const lastOption = questions.length ? questions.at(-1).options[answers.at(-1)] : null;
        const field = tied.length === 1 ? tied[0] : (lastOption && tied.includes(lastOption.field) ? lastOption.field : tied[0]);
        const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
        const percentages = Object.fromEntries(FIELD_ORDER.map(name => [name, total ? Math.round((scores[name] / total) * 100) : 0]));
        return { field, scores, percentages };
    }

    globalThis.QuizScoring = { calculateResult };

    document.addEventListener('DOMContentLoaded', () => {
        const status = document.getElementById('quizStatus');
        const content = document.getElementById('quizContent');
        const resultPanel = document.getElementById('quizResult');
        const questionText = document.getElementById('questionText');
        const answerList = document.getElementById('answerList');
        const progressBar = document.getElementById('progressBar');
        const progress = document.querySelector('.quiz-progress');
        const progressLabel = document.getElementById('progressLabel');
        const progressPercent = document.getElementById('progressPercent');
        const backButton = document.getElementById('backButton');
        const nextButton = document.getElementById('nextButton');
        let questions = [];
        let fields = FIELD_NAMES;
        let answers = [];
        let current = 0;

        function renderQuestion() {
            const question = questions[current];
            questionText.textContent = question.text;
            answerList.replaceChildren();
            question.options.forEach((option, index) => {
                const label = document.createElement('label');
                label.className = 'answer-option';
                const input = document.createElement('input');
                input.type = 'radio';
                input.name = 'quizAnswer';
                input.value = String(index);
                input.checked = answers[current] === index;
                input.addEventListener('change', () => {
                    answers[current] = index;
                    nextButton.disabled = false;
                });
                const text = document.createElement('span');
                text.textContent = option.text;
                label.append(input, text);
                answerList.append(label);
            });
            const percent = Math.round(((current + 1) / questions.length) * 100);
            progressBar.style.width = `${percent}%`;
            progress.setAttribute('aria-valuenow', String(percent));
            progressLabel.textContent = `السؤال ${current + 1} من ${questions.length}`;
            progressPercent.textContent = `${percent}%`;
            backButton.disabled = current === 0;
            nextButton.disabled = !Number.isInteger(answers[current]);
            nextButton.textContent = current === questions.length - 1 ? 'عرض النتيجة' : 'التالي';
        }

        function showResult() {
            const outcome = calculateResult(questions, answers);
            const explanation = `تُظهر إجاباتك ميلاً أكبر إلى مجال ${fields[outcome.field]}، حيث تلتقي اهتماماتك ومهاراتك في هذا المسار.`;
            let storageError = false;
            try {
                localStorage.setItem('cs_field', outcome.field);
                localStorage.setItem('cs_scores', JSON.stringify(outcome));
                status.textContent = '';
            } catch (_) {
                storageError = true;
                status.textContent = 'تعذّر حفظ النتيجة على هذا الجهاز، لكن يمكنك متابعة استكشاف مسارك.';
                status.classList.add('error');
            }
            resultPanel.replaceChildren();
            const head = document.createElement('div');
            head.className = 'result-head';
            const eyebrow = document.createElement('span');
            eyebrow.className = 'quiz-eyebrow';
            eyebrow.textContent = 'نتيجتك';
            const title = document.createElement('h2');
            title.textContent = 'المجال الموصى به لك';
            const field = document.createElement('p');
            field.className = 'result-field';
            field.textContent = fields[outcome.field];
            const why = document.createElement('p');
            why.textContent = explanation;
            head.append(eyebrow, title, field, why);
            const scoreList = document.createElement('div');
            scoreList.className = 'score-list';
            FIELD_ORDER.forEach(name => {
                const item = document.createElement('div');
                const label = document.createElement('div');
                label.className = 'score-label';
                const nameSpan = document.createElement('span');
                nameSpan.textContent = fields[name];
                const value = document.createElement('strong');
                value.textContent = `${outcome.percentages[name]}%`;
                label.append(nameSpan, value);
                const track = document.createElement('div');
                track.className = 'score-track';
                track.setAttribute('role', 'img');
                track.setAttribute('aria-label', `${fields[name]}: ${outcome.percentages[name]}%`);
                const bar = document.createElement('span');
                bar.style.width = `${outcome.percentages[name]}%`;
                track.append(bar);
                item.append(label, track);
                scoreList.append(item);
            });
            const actions = document.createElement('div');
            actions.className = 'result-actions';
            actions.innerHTML = '<a href="roadmaps.html">افتح خريطة التعلّم</a><a class="secondary-link" href="interview.html">تدرّب على أسئلة المقابلات</a>';
            const retake = document.createElement('button');
            retake.type = 'button';
            retake.className = 'retake-button';
            retake.textContent = 'أعد الاختبار';
            retake.addEventListener('click', resetQuiz);
            resultPanel.append(head, scoreList, actions, retake);
            content.hidden = true;
            resultPanel.hidden = false;
            if (!storageError) status.textContent = '';
        }

        function resetQuiz() {
            answers = [];
            current = 0;
            resultPanel.hidden = true;
            content.hidden = false;
            renderQuestion();
        }

        backButton.addEventListener('click', () => {
            if (current > 0) { current -= 1; renderQuestion(); }
        });
        nextButton.addEventListener('click', () => {
            if (!Number.isInteger(answers[current])) return;
            if (current === questions.length - 1) showResult();
            else { current += 1; renderQuestion(); }
        });

        fetch('../data/quiz.json')
            .then(response => {
                if (!response.ok) throw new Error('Unable to load quiz data');
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data.questions) || data.questions.length < 10 || data.questions.length > 12) throw new Error('Invalid quiz data');
                questions = data.questions;
                fields = data.fields || FIELD_NAMES;
                status.textContent = '';
                content.hidden = false;
                renderQuestion();
            })
            .catch(() => {
                status.classList.add('error');
                status.textContent = 'تعذّر تحميل أسئلة الاختبار. حدّث الصفحة وحاول مرة أخرى.';
            });
    });
})();
