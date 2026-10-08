import { useState } from "react";
import type { ReactNode, SubmitEvent } from "react";

type Screen =
  | "login"
  | "signup"
  | "recovery"
  | "reset"
  | "course"
  | "start"
  | "quiz"
  | "subjects"
  | "goal"
  | "done";

function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""} ${compact ? "logo-compact" : ""}`}>
      <span className="logo-mark" aria-hidden="true"><i /><b>✦</b></span>
      <strong>EduMentor</strong>
      <em>AI</em>
    </div>
  );
}

function BrandPanel() {
  return (
    <aside className="brand-panel">
      <Logo light />
      <div className="brand-copy">
        <h1>Sua trilha até o ENEM, com uma tutora 24h.</h1>
        <p>Trilhas personalizadas, simulados com questões reais e a Mentorina para tirar dúvidas a qualquer hora.</p>
      </div>
      <div className="brand-stairs" aria-hidden="true">
        <span /><span /><span />
        <i>✓</i>
      </div>
    </aside>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  children,
  className = "",
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <label className={`field ${className}`}>
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input type={type} placeholder={placeholder ?? label} aria-label={label ?? placeholder} required />
        {children}
      </span>
    </label>
  );
}

function AuthTabs({ active, go }: { active: "login" | "signup"; go: (screen: Screen) => void }) {
  return (
    <nav className="auth-tabs" aria-label="Acesso">
      <button type="button" className={active === "signup" ? "active" : ""} onClick={() => go("signup")}>Criar conta</button>
      <button type="button" className={active === "login" ? "active" : ""} onClick={() => go("login")}>Fazer login</button>
    </nav>
  );
}

function AccountModal({ close, continueFlow }: { close: () => void; continueFlow: () => void }) {
  const [account, setAccount] = useState("vestibulando");
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title">
        <span className="eyebrow">Passo de segurança</span>
        <h2 id="account-title">Com qual conta você quer entrar?</h2>
        <p>Encontramos mais de uma conta ligada a este e-mail. Escolha qual perfil você quer usar agora.</p>
        <div className="account-list">
          {[
            ["vestibulando", "Vestibulando", "Preparação para o ENEM · Medicina", "◎"],
            ["universitario", "Universitário", "Graduação · Engenharia Civil", "◇"],
          ].map(([id, title, description, icon]) => (
            <button
              type="button"
              className={`account-option ${account === id ? "selected" : ""}`}
              onClick={() => setAccount(id)}
              key={id}
            >
              <i>{icon}</i>
              <span><strong>{title}</strong><small>{description}</small></span>
              <b>{account === id ? "✓" : ""}</b>
            </button>
          ))}
        </div>
        <div className="token-note">Por segurança, faça sua escolha em alguns minutos. Se o tempo acabar, é só entrar de novo.</div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={close}>Voltar ao login</button>
          <button type="button" className="primary-button" onClick={continueFlow}>Entrar com esta conta</button>
        </div>
      </section>
    </div>
  );
}

function Login({ go }: { go: (screen: Screen) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [accounts, setAccounts] = useState(false);

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accepted) setAccounts(true);
  }

  return (
    <AuthLayout>
      <div className="auth-form login-form">
        <AuthTabs active="login" go={go} />
        <header className="form-heading"><h2>Que bom te ver por aqui!</h2><p>Entre para iniciar sua trilha.</p></header>
        <form onSubmit={submit}>
          <Field type="email" placeholder="nome@email.com" />
          <Field type={showPassword ? "text" : "password"} placeholder="senha">
            <button className="input-action" type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Ocultar" : "Mostrar"}</button>
          </Field>
          <button className="text-button forgot" type="button" onClick={() => go("recovery")}>Esqueceu sua senha?</button>
          <label className="check-row"><input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} /><span>Li e concordo com os <u>Termos de uso</u></span></label>
          <button className="primary-button" type="submit" disabled={!accepted}>Entrar</button>
        </form>
        <p className="auth-switch">Não possui uma conta? <button type="button" onClick={() => go("signup")}>Criar conta</button></p>
        <button className="support-link" type="button">Precisa de ajuda? <strong>Fale com o suporte</strong></button>
      </div>
      {accounts && <AccountModal close={() => setAccounts(false)} continueFlow={() => go("course")} />}
    </AuthLayout>
  );
}

function Signup({ go }: { go: (screen: Screen) => void }) {
  const [birthDate, setBirthDate] = useState("");
  const age = birthDate ? Math.floor((Date.now() - new Date(birthDate).getTime()) / 31557600000) : null;
  const minor = age !== null && age < 18;

  return (
    <AuthLayout>
      <div className="auth-form signup-form">
        <AuthTabs active="signup" go={go} />
        <header className="form-heading"><h2>Bora criar sua conta?</h2><p>Leva menos de 1 minutos.</p></header>
        <form onSubmit={(event) => { event.preventDefault(); go("course"); }}>
          <Field placeholder="Nome completo" />
          <div className="field-row">
            <label className="field"><span></span><span className="input-shell"><input lang="pt-BR" type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />{!birthDate && <span className="date-placeholder" aria-hidden="true">Data de nascimento</span>}</span></label>
            <Field type="tel" placeholder="Celular" />
          </div>
          <Field type="email" placeholder="E-mail" />
          <Field type="email" placeholder="E-mail de recuperação" />
          <small className="field-help">É para ele que enviamos o link de nova senha.</small>
          <div className="field-row"><Field type="password" placeholder="Senha" /><Field type="password" placeholder="Confirmar senha" /></div>
          {minor && (
            <fieldset className="guardian-card">
              <legend>Vimos que você tem menos de 18 anos</legend>
              <p>Precisamos dos dados do seu responsável legal.</p>
              <Field placeholder="Nome completo" />
              <Field placeholder="CPF do responsável" />
            </fieldset>
          )}
          <button className="primary-button" type="submit">Criar conta</button>
        </form>
      </div>
    </AuthLayout>
  );
}

function PasswordScreen({ reset, go }: { reset?: boolean; go: (screen: Screen) => void }) {
  const [sent, setSent] = useState(false);
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const validLength = password.length >= 8;
  const validMix = /[a-zA-Z]/.test(password) && /\d/.test(password);
  const same = password.length > 0 && password === confirmation;

  return (
    <AuthLayout>
      <div className="auth-form password-form">
        <button className="back-link" type="button" onClick={() => go("login")}>← Voltar{reset ? " ao login" : ""}</button>
        <header className="form-heading">
          <h2>{reset ? "Crie uma nova senha" : "Esqueceu a senha?"}</h2>
          <p>{reset ? "Escolha uma senha que você não use em outros sites." : "Digite seu e-mail de recuperação. Vamos enviar um link para você criar uma nova senha. Ele vale por 1 hora."}</p>
        </header>
        {!reset ? (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <Field label="E-mail de recuperação" type="email" placeholder="nome@email.com" />
            <button className="primary-button" type="submit">Enviar link</button>
            {sent && <div className="success-state"><strong>✓ Link enviado!</strong><span>Confira sua caixa de entrada e o spam.</span><button type="button" onClick={() => go("reset")}>Abrir link recebido</button></div>}
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (validLength && validMix && same) go("login"); }}>
            <label className="field"><span>Nova senha</span><span className="input-shell"><input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required /><button className="input-action" type="button" onClick={() => setShow(!show)}>{show ? "Ocultar" : "Mostrar"}</button></span></label>
            <label className="field"><span>Confirmar nova senha</span><span className="input-shell"><input type={show ? "text" : "password"} value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required /></span></label>
            <ul className="password-rules"><li className={validLength ? "valid" : ""}>Pelo menos 8 caracteres</li><li className={validMix ? "valid" : ""}>Letras e números</li><li className={same ? "valid" : ""}>As duas senhas são iguais</li></ul>
            <button className="primary-button" type="submit" disabled={!validLength || !validMix || !same}>Redefinir senha</button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

function AuthLayout({ children }: { children: ReactNode }) {
  return <main className="auth-screen"><BrandPanel /><section className="auth-content">{children}</section></main>;
}

function Stepper({ step, back }: { step: number; back: () => void }) {
  const labels = ["Curso-alvo", "Como começar", "Meta semanal"];
  return (
    <header className="onboarding-header">
      <Logo compact />
      <div className="stepper">
        {labels.map((label, index) => <div className={index + 1 <= step ? "complete" : ""} key={label}><i>{index + 1 < step ? "✓" : index + 1}</i><span>{label}</span>{index < 2 && <b />}</div>)}
      </div>
      <button className="back-link" type="button" onClick={back}>← Voltar</button>
    </header>
  );
}

function OnboardingLayout({ step, back, children }: { step: number; back: () => void; children: ReactNode }) {
  return <main className="onboarding"><Stepper step={step} back={back} /><section className="onboarding-content">{children}</section></main>;
}

function Course({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={1} back={() => go("signup")}>
      <div className="center-heading"><h1>Qual curso você quer fazer?</h1><p>Com isso, sua trilha dá mais peso às áreas que mais contam para o seu curso.</p></div>
      <div className="course-fields"><Field label="Curso" placeholder="Medicina" /><Field label="Universidade" placeholder="Universidade de São Paulo (USP)" /></div>
      <div className="weight-card"><span>Áreas com mais peso para Medicina</span><div><b>Ciências da Natureza</b><b>Matemática</b><b>Redação</b></div></div>
      <button className="primary-button narrow" type="button" onClick={() => go("start")}>Continuar</button>
    </OnboardingLayout>
  );
}

function StartChoice({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={2} back={() => go("course")}>
      <div className="center-heading"><h1>Como você quer começar?</h1><p>O nivelamento mostra seu nível em cada área e ajuda a IA a montar uma trilha no seu ritmo.</p></div>
      <div className="choice-grid">
        <article className="choice-card recommended"><div><i>◎</i><span>Recomendado</span></div><h2>Fazer o nivelamento</h2><p>6 questões · cerca de 10 min. Descubra o seu nível em cada área.</p><button className="primary-button" type="button" onClick={() => go("quiz")}>Fazer nivelamento</button></article>
        <article className="choice-card"><div><i>▤</i></div><h2>Escolher as matérias</h2><p>Você escolhe as matérias que quer focar e a IA gera a trilha delas.</p><button className="secondary-button" type="button" onClick={() => go("subjects")}>Escolher matérias</button></article>
      </div>
    </OnboardingLayout>
  );
}

function Quiz({ go }: { go: (screen: Screen) => void }) {
  const [answer, setAnswer] = useState("C");
  const answers = [["A", "10%"], ["B", "15%"], ["C", "16,7%"], ["D", "20%"], ["E", "25%"]];
  return (
    <OnboardingLayout step={2} back={() => go("start")}>
      <div className="quiz-layout">
        <section className="quiz-main">
          <div className="quiz-meta"><span>Matemática</span><b>Questão 3 de 6</b></div>
          <div className="progress-segments">{[1, 2, 3, 4, 5, 6].map((n) => <i className={n <= 3 ? "filled" : ""} key={n} />)}</div>
          <div className="question-card">Uma loja vende camisetas por R$ 30,00 cada. Na promoção, quem leva 3 paga R$ 75,00. Qual é o desconto por camiseta, em porcentagem?</div>
          <div className="answers">{answers.map(([letter, value]) => <button type="button" className={answer === letter ? "selected" : ""} onClick={() => setAnswer(letter)} key={letter}><i>{letter}</i>{value}</button>)}</div>
          <button className="primary-button quiz-next" type="button" onClick={() => go("subjects")}>Próxima</button>
        </section>
        <aside className="area-progress"><h2>Progresso por área</h2>{[["Linguagens", 100], ["Humanas", 100], ["Natureza", 50], ["Matemática", 34], ["Redação", 4]].map(([label, value]) => <div key={label as string}><span>{label}</span><small>{Number(value) === 100 ? "Concluída" : `${value}%`}</small><i><b style={{ width: `${value}%` }} /></i></div>)}</aside>
      </div>
    </OnboardingLayout>
  );
}

const subjectList = ["Matemática", "Ciências da Natureza", "Linguagens", "Ciências Humanas", "Redação"];

function Subjects({ go }: { go: (screen: Screen) => void }) {
  const [selected, setSelected] = useState(["Matemática", "Ciências da Natureza"]);
  function toggle(subject: string) {
    setSelected((items) => items.includes(subject) ? items.filter((item) => item !== subject) : [...items, subject]);
  }
  return (
    <OnboardingLayout step={2} back={() => go("start")}>
      <div className="center-heading"><h1>Quais matérias você quer focar?</h1><p>Selecione uma ou mais. A IA gera uma trilha para cada matéria.</p></div>
      <div className="subject-grid">{subjectList.map((subject, index) => <button type="button" className={selected.includes(subject) ? "selected" : ""} onClick={() => toggle(subject)} key={subject}><i>{selected.includes(subject) ? "✓" : ""}</i><b className={`subject-dot dot-${index}`} /> <span>{subject}</span>{selected.includes(subject) && <em>{selected.indexOf(subject) + 1}º</em>}</button>)}</div>
      <div className="info-strip">ⓘ Uma trilha por vez: termine uma para liberar a próxima. A ordem da seleção define a prioridade.</div>
      <button className="primary-button narrow" type="button" disabled={!selected.length} onClick={() => go("goal")}>Continuar</button>
    </OnboardingLayout>
  );
}

function Goal({ go }: { go: (screen: Screen) => void }) {
  const [hours, setHours] = useState(25);
  const [days, setDays] = useState(["Seg", "Ter", "Qua", "Qui", "Sex"]);
  const week = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return (
    <OnboardingLayout step={3} back={() => go("subjects")}>
      <div className="center-heading"><h1>Quanto você quer estudar por semana?</h1><p>Dá para mudar depois no seu perfil.</p></div>
      <div className="goal-grid">
        <section className="goal-card">
          <div className="hours-control"><button type="button" onClick={() => setHours(Math.max(5, hours - 5))}>−</button><span><strong>{hours}</strong><small>horas por semana</small></span><button type="button" onClick={() => setHours(Math.min(50, hours + 5))}>+</button></div>
          <h3>Dias de estudo</h3>
          <div className="week-days">{week.map((day) => <button type="button" className={days.includes(day) ? "selected" : ""} onClick={() => setDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day])} key={day}>{day}</button>)}</div>
          <p>{days.length} dias · cerca de {days.length ? Math.round(hours / days.length) : 0} horas por dia</p>
        </section>
        <aside className="exam-card"><span>ENEM · 1º dia em 08/11</span><strong>39</strong><h3>dias até a prova</h3><p>Sua trilha será montada até essa data.</p></aside>
      </div>
      <button className="primary-button narrow" type="button" onClick={() => go("done")}>✦ Gerar minha trilha</button>
    </OnboardingLayout>
  );
}

function Done({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={3} back={() => go("goal")}>
      <div className="done-card"><i>✓</i><h1>Sua trilha está pronta!</h1><p>Organizamos seus estudos de acordo com seu curso, suas prioridades e sua rotina semanal.</p><button className="primary-button narrow" type="button" onClick={() => go("login")}>Ir para o início</button></div>
    </OnboardingLayout>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  if (screen === "login") return <Login go={setScreen} />;
  if (screen === "signup") return <Signup go={setScreen} />;
  if (screen === "recovery") return <PasswordScreen go={setScreen} />;
  if (screen === "reset") return <PasswordScreen reset go={setScreen} />;
  if (screen === "course") return <Course go={setScreen} />;
  if (screen === "start") return <StartChoice go={setScreen} />;
  if (screen === "quiz") return <Quiz go={setScreen} />;
  if (screen === "subjects") return <Subjects go={setScreen} />;
  if (screen === "goal") return <Goal go={setScreen} />;
  return <Done go={setScreen} />;
}
