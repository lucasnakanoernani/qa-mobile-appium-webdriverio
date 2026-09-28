export async function gerarCartao(): Promise<Cartao> {
  const response = await fetch(
        'https://www.4devs.com.br/ferramentas_online.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              acao: 'gerar_cc',
              pontuacao: 'S',
              bandeira: 'master'
            }),
        }
    );

  if (!response.ok) {
        throw new Error(
            `Erro ao gerar cartão. Status: ${response.status}`
          );
  }

  const html = await response.text();

  // número
  const numero = html.match(/id="cartao_numero"[\s\S]*?>(.*?)</)?.[1]?.trim();

  if (!numero) {
    console.log('HTML recebido:', html);
    throw new Error('Erro ao capturar numero');
  }

  // validade
  const validadeMatch = html.match(/id="data_validade"[\s\S]*?>(.*?)</);
  const validadeCompleta = validadeMatch?.[1]?.trim();

  if (!validadeCompleta) {
    console.log('HTML recebido:', html);
    throw new Error('Erro ao capturar validade');
  }

  // tratamento
  const partes = validadeCompleta.split('/');
  const data = `${partes[1]}/${partes[2]}`;

  // cvv
  const cvv = html.match(/id="codigo_seguranca"[\s\S]*?>(.*?)</)?.[1]?.trim();
  if (!cvv) {
    console.log('HTML recebido:', html);
    throw new Error('Erro ao capturar cvv');
  }

  return {
    numero,
    data,
    cvv,
    nome: 'Lucas Teste'
  };

}

export interface Cartao {
    numero: string;
    data: string;
    cvv: string;
    nome: string;
}