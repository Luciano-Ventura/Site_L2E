/**
 * L2E Tecnologia Rodoviária - Configuração Institucional Centralizada
 * Fonte única de dados institucionais (SSOT).
 * Evita divergências e duplicações entre páginas, metadados e scripts.
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.L2E_CONFIG = factory();
        root.L2E = root.L2E_CONFIG; // Alias de conveniência
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const CONFIG = Object.freeze({
        empresa: Object.freeze({
            nomeComercial: "L2E Tecnologia Rodoviária",
            nomeCurto: "L2E",
            cnpj: "69.585.506/0001-06",
            cnpjNumeros: "69585506000106",
            experienciaProfissionaisAnos: 11,
            posicionamento: "Sua parceira especializada em levantamentos e dados de tráfego."
        }),
        localizacao: Object.freeze({
            cidade: "São José",
            estado: "Santa Catarina",
            uf: "SC",
            cidadeUf: "São José/SC",
            cidadeEstado: "São José — Santa Catarina",
            pais: "Brasil",
            paisCodigo: "BR",
            abrangencia: "Atendimento a projetos em diferentes regiões do Brasil, conforme viabilidade operacional.",
            abrangenciaCurta: "Atendimento em diferentes regiões do Brasil"
        }),
        contato: Object.freeze({
            email: "contato.l2etec@gmail.com",
            telefoneFormatado: "(48) 99932-4253",
            telefoneInternacional: "+5548999324253",
            whatsappNumero: "5548999324253",
            siteUrl: "https://www.l2etec.com.br"
        }),
        whatsappMensagens: Object.freeze({
            orcamento: "Olá! Gostaria de solicitar um orçamento para levantamento e processamento de dados de tráfego.",
            propostaApresentacao: "Olá! Conheci a apresentação institucional da L2E e gostaria de solicitar uma proposta para um levantamento de tráfego.",
            cotacaoProjeto: "Olá! Gostaria de solicitar uma cotação para levantamento de tráfego no meu projeto.",
            fornecedor: "Olá! Gostaria de informações para cadastro e homologação da L2E Tecnologia Rodoviária como fornecedora.",
            geral: "Olá! Gostaria de mais informações sobre os serviços da L2E Tecnologia Rodoviária."
        }),
        documentos: Object.freeze({
            pdfApresentacao: "assets/L2E-Apresentacao-Institucional.pdf"
        }),
        helpers: {
            /**
             * Retorna o link completo do WhatsApp com texto codificado
             * @param {string} tipo - Chave de mensagem ('orcamento', 'propostaApresentacao', 'cotacaoProjeto', 'fornecedor', 'geral')
             * @param {string} [textoCustomizado] - Texto opcional para sobrescrever
             * @returns {string} URL wa.me formatada
             */
            getWhatsAppUrl: function (tipo, textoCustomizado) {
                const mensagens = CONFIG.whatsappMensagens;
                const texto = textoCustomizado || mensagens[tipo] || mensagens.geral;
                return "https://wa.me/" + CONFIG.contato.whatsappNumero + "?text=" + encodeURIComponent(texto);
            },
            /**
             * Retorna link mailto formatado
             * @param {string} [assunto]
             * @returns {string}
             */
            getMailtoUrl: function (assunto) {
                const subjectParam = assunto ? "?subject=" + encodeURIComponent(assunto) : "";
                return "mailto:" + CONFIG.contato.email + subjectParam;
            },
            /**
             * Retorna link tel formatado
             * @returns {string}
             */
            getTelUrl: function () {
                return "tel:" + CONFIG.contato.telefoneInternacional;
            },
            /**
             * Aplica dinamicamente os dados aos elementos HTML com data-attributes correspondentes,
             * preservando o fallback estático existente.
             */
            applyToDOM: function () {
                if (typeof document === 'undefined') return;

                // Textos simples: data-l2e-text="empresa.cnpj", etc.
                const textElements = document.querySelectorAll('[data-l2e-text]');
                textElements.forEach(function (el) {
                    const path = el.getAttribute('data-l2e-text');
                    const value = path.split('.').reduce(function (acc, key) {
                        return acc && acc[key] !== undefined ? acc[key] : null;
                    }, CONFIG);
                    if (value !== null) {
                        el.textContent = value;
                    }
                });

                // WhatsApp links: data-l2e-wa="orcamento", etc.
                const waElements = document.querySelectorAll('[data-l2e-wa]');
                waElements.forEach(function (el) {
                    const tipo = el.getAttribute('data-l2e-wa');
                    el.setAttribute('href', CONFIG.helpers.getWhatsAppUrl(tipo));
                });

                // Mailto links: data-l2e-email="Assunto opcional"
                const emailElements = document.querySelectorAll('[data-l2e-email]');
                emailElements.forEach(function (el) {
                    const assunto = el.getAttribute('data-l2e-email');
                    el.setAttribute('href', CONFIG.helpers.getMailtoUrl(assunto));
                });

                // Tel links: data-l2e-tel
                const telElements = document.querySelectorAll('[data-l2e-tel]');
                telElements.forEach(function (el) {
                    el.setAttribute('href', CONFIG.helpers.getTelUrl());
                });
            }
        }
    });

    return CONFIG;
}));
