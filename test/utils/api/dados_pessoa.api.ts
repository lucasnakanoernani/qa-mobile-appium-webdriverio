export async function gerarPessoa(): Promise<Pessoa> {
    const response = await fetch(
        'https://www.4devs.com.br/ferramentas_online.php',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                acao: 'gerar_pessoa',
                sexo: 'I',
                idade: 'S',
                txt_qtde: '1',
            }),
        }
    );

    if (!response.ok) {
        throw new Error(
            `Erro ao gerar pessoa. Status: ${response.status}`
        );
    }

    const data = await response.json();

    const pessoa = data[0];

    const nomeCompleto = pessoa.nome.split(' ');

    function formatarData(data: string) {
        const [dia, mes, ano] = data.split('/');
        return `${dia}${mes}${ano}`;
    }

    return {
        nome: nomeCompleto[0],
        sobrenome: nomeCompleto.slice(1).join(' '),
        email: pessoa.email,
        CPF: pessoa.cpf,
        RG: pessoa.rg,
        sexo: pessoa.sexo,
        celular: pessoa.celular,
        dataNascimento: formatarData(pessoa.data_nasc),
        civil: 'Solteiro(a)',
        profissao: 'QA',
        CEP: pessoa.cep,
        numero: String(pessoa.numero),
    };
}

export interface Pessoa {
    nome: string;
    sobrenome: string;
    email: string;
    CPF: string;
    RG: string;
    sexo: string;
    celular: string;
    dataNascimento: string;
    civil: string;
    profissao: string;
    CEP: string;
    numero: string;
}