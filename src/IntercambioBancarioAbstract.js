const HeaderArquivo = require('./Model/HeaderArquivo.js');
const TrailerArquivo = require('./Model/TrailerArquivo.js');

export default class IntercambioBancarioAbstract {
    header;
    trailer;
    lotes;
    layout;

    constructor(layout){
        this.layout = layout;
        this.header = new HeaderArquivo();
        this.trailer = new TrailerArquivo();
        this.lotes = [];
    }

	getLayout(){
		return this.layout;
	}

    inserirLote(lote){
        this.lotes.push(lote);
        return this;
    }

    removerLote(sequencial)
    {
        let found = -1;

        this.lotes.foreach((lote, indice) => {
            if (lote.sequencial == sequencial) {
                found = indice;
                return;
            }
        });

        if (found > -1) {
            this.lotes[found] = undefined;
        }

        return this;
    }

    limparLotes()
    {
        this.lotes = array();
        return this;
    }

    jsonSerialize()
    {
        headerArquivo = this.header.jsonSerialize();
        trailerArquivo = this.trailer.jsonSerialize();
        lotes = this.lotes;

        return {
            'header_arquivo': headerArquivo,
            'lotes': lotes,
            'trailer_arquivo': trailerArquivo
        };
    }
}