export const termosService = {
  /**
   * Solicita o reenvio do termo em PDF por e-mail para o usuário autenticado.
   */
  async reenviarPorEmail(): Promise<{ message: string }> {
    const response = await fetch("/api/termos/enviar-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || "Não foi possível reenviar o termo por e-mail.",
      );
    }

    return (
      data || {
        message: "Termo de adesão gerado e enviado por e-mail com sucesso.",
      }
    );
  },

  /**
   * Faz o download do PDF em memória ou abre em nova aba.
   * @param abrirEmNovaAba Se true, abre a pré-visualização no navegador em nova aba.
   */
  async baixarPdf(abrirEmNovaAba = false): Promise<void> {
    const response = await fetch("/api/termos/download", {
      method: "GET",
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      throw new Error(
        data?.message || "Não foi possível baixar o termo de adesão.",
      );
    }

    const blob = await response.blob();
    const file = new Blob([blob], { type: "application/pdf" });
    const fileURL = URL.createObjectURL(file);

    if (abrirEmNovaAba) {
      window.open(fileURL, "_blank");
    } else {
      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", "Termo_de_Adesao_Sherlock.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
  },
};

