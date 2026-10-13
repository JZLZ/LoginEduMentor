import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { StudentTermsCard } from "./StudentTermsCard";
import { termosService } from "@/src/services/termosService";

vi.mock("@/src/services/termosService", () => ({
  termosService: {
    baixarPdf: vi.fn(),
    reenviarPorEmail: vi.fn(),
  },
}));

describe("StudentTermsCard", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza o card de termos e botões de ação", () => {
    render(<StudentTermsCard />);

    expect(screen.getByText("Termo de Adesão e Uso")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /visualizar termo/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /baixar pdf/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("button", { name: /reenviar por e-mail/i }),
    ).toBeVisible();
  });

  it("chama baixarPdf em modo pré-visualização ao clicar em Visualizar Termo", async () => {
    const user = userEvent.setup();
    vi.mocked(termosService.baixarPdf).mockResolvedValueOnce(undefined);

    render(<StudentTermsCard />);

    const viewButton = screen.getByRole("button", { name: /visualizar termo/i });
    await user.click(viewButton);

    expect(termosService.baixarPdf).toHaveBeenCalledWith(true);
  });

  it("chama baixarPdf e exibe feedback de sucesso ao clicar em Baixar PDF", async () => {
    const user = userEvent.setup();
    vi.mocked(termosService.baixarPdf).mockResolvedValueOnce(undefined);

    render(<StudentTermsCard />);

    const downloadButton = screen.getByRole("button", { name: /baixar pdf/i });
    await user.click(downloadButton);

    expect(termosService.baixarPdf).toHaveBeenCalledWith(false);
    expect(
      await screen.findByText("Download do PDF iniciado com sucesso!"),
    ).toBeVisible();
  });

  it("chama reenviarPorEmail e exibe mensagem de sucesso retornada", async () => {
    const user = userEvent.setup();
    vi.mocked(termosService.reenviarPorEmail).mockResolvedValueOnce({
      message: "Termo de adesão enviado para o seu e-mail com sucesso!",
    });

    render(<StudentTermsCard />);

    const emailButton = screen.getByRole("button", {
      name: /reenviar por e-mail/i,
    });
    await user.click(emailButton);

    expect(termosService.reenviarPorEmail).toHaveBeenCalled();
    expect(
      await screen.findByText(
        "Termo de adesão enviado para o seu e-mail com sucesso!",
      ),
    ).toBeVisible();
  });

  it("exibe mensagem de erro quando o reenvio falha", async () => {
    const user = userEvent.setup();
    vi.mocked(termosService.reenviarPorEmail).mockRejectedValueOnce(
      new Error("Serviço de e-mail indisponível no momento."),
    );

    render(<StudentTermsCard />);

    const emailButton = screen.getByRole("button", {
      name: /reenviar por e-mail/i,
    });
    await user.click(emailButton);

    expect(
      await screen.findByText("Serviço de e-mail indisponível no momento."),
    ).toBeVisible();
  });
});

