import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import Signup from "./index";

const { pushMock, signupActionMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  signupActionMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/src/actions/signupAction", () => ({
  signupAction: signupActionMock,
}));

async function fillRequiredFields(birthDate = "15/03/2000") {
  const user = userEvent.setup();
  render(<Signup />);

  await user.type(screen.getByLabelText("Nome completo"), "Maria da Silva");
  await user.type(screen.getByLabelText("Data de nascimento"), birthDate);
  await user.type(screen.getByLabelText("Celular"), "11912345678");
  await user.type(screen.getByLabelText("E-mail"), "maria@example.com");
  await user.type(
    screen.getByLabelText("E-mail de recuperação"),
    "recuperacao@example.com",
  );
  await user.type(screen.getByLabelText("Senha"), "Forte@9xQ");
  await user.type(screen.getByLabelText("Confirmar senha"), "Forte@9xQ");
  await user.selectOptions(
    screen.getByLabelText("Escolaridade"),
    "ENSINO_MEDIO",
  );
  await user.click(screen.getByLabelText(/Li e aceito os/i));

  return user;
}

describe("Signup", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("impede o envio e mostra os erros dos campos obrigatórios", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    expect(screen.getByText("Nome completo é obrigatório.")).toBeVisible();
    expect(
      screen.getByText("Data de nascimento é obrigatória."),
    ).toBeVisible();
    expect(screen.getByText("Escolaridade é obrigatória.")).toBeVisible();
    expect(screen.getByText("Termo de Uso obrigatório.")).toBeVisible();
    expect(signupActionMock).not.toHaveBeenCalled();
  });

  it("exibe os dados do responsável somente para aluno menor de idade", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const birthDate = screen.getByLabelText("Data de nascimento");
    expect(
      screen.queryByLabelText("Nome do responsável legal"),
    ).not.toBeInTheDocument();

    await user.type(birthDate, "15/03/2020");
    expect(screen.getByLabelText("Nome do responsável legal")).toBeVisible();
    expect(screen.getByLabelText("CPF do responsável")).toBeVisible();

    await user.clear(birthDate);
    await user.type(birthDate, "15/03/2000");
    expect(
      screen.queryByLabelText("Nome do responsável legal"),
    ).not.toBeInTheDocument();
  });

  it("envia o cadastro de maior de idade e redireciona para o login", async () => {
    signupActionMock.mockResolvedValueOnce({ success: true });
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => {
      expect(signupActionMock).toHaveBeenCalledWith({
        nomeCompleto: "Maria da Silva",
        dataNascimento: "2000-03-15",
        escolaridade: "ENSINO_MEDIO",
        email: "maria@example.com",
        emailRecuperacao: "recuperacao@example.com",
        celular: "(11) 91234-5678",
        senha: "Forte@9xQ",
        confirmarSenha: "Forte@9xQ",
      });
    });
    expect(pushMock).toHaveBeenCalledWith("/login?cadastro=sucesso");
  });

  it("envia os dados do responsável no cadastro de menor de idade", async () => {
    signupActionMock.mockResolvedValueOnce({ success: true });
    const user = await fillRequiredFields("15/03/2020");

    await user.type(
      screen.getByLabelText("Nome do responsável legal"),
      "Joana da Silva",
    );
    await user.type(screen.getByLabelText("CPF do responsável"), "52998224725");
    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    await waitFor(() => {
      expect(signupActionMock).toHaveBeenCalledWith(
        expect.objectContaining({
          dataNascimento: "2020-03-15",
          responsavelLegal: {
            nomeCompleto: "Joana da Silva",
            cpf: "52998224725",
          },
        }),
      );
    });
  });

  it("mostra a mensagem retornada quando o e-mail já está cadastrado", async () => {
    signupActionMock.mockResolvedValueOnce({
      success: false,
      message: "E-mail já cadastrado.",
    });
    const user = await fillRequiredFields();

    await user.click(screen.getByRole("button", { name: "Criar conta" }));

    const errorMessage = await screen.findByText("E-mail já cadastrado.");
    expect(errorMessage).toHaveAttribute("role", "alert");
    expect(pushMock).not.toHaveBeenCalled();
  });
});
