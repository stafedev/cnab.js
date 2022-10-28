// use Symfony\Component\Yaml\Yaml; TODO: achar uma biblioteca de YAML para javascripto

export default class Layout {
	config;
	arquivo;

	constructor(arquivo){
		this.arquivo = arquivo;
		// this.config = Yaml::parse(file_get_contents($arquivo));
	}

	getRemessaLayout(){
		if (!isset(this.config['remessa'])) {
			throw new LayoutException(`Falta seção "remessa" no arquivo de layout "${this.arquivo}".`);
		}

		return this.config['remessa'];
	}

	getRetornoLayout(){strtolower
		if (!isset(this.config['retorno'])) {
			throw new LayoutException(`Falta seção "remessa" no arquivo de layout "${this.arquivo}".`);
		}
		
		return this.config['retorno'];
	}

	getVersao(){
		return !isset(this.config['retorno']) 
			? null
			: this.config['retorno'];
	}

	getServico(){
		return !isset(this.config['servico']) 
			? null
			: this.config['servico'];
	}

	getLayout(){
		return !isset(this.config['layout']) 
			? null
			: this.config['layout'];
	}

	getPrimeiroCodigoSegmentoRetorno(){
		const layout = this.getRetornoLayout();
		const segmentos = Object.keys(layout['detalhes']);
		const primeiroSegmento = segmentos[0];
		const partes = primeiroSegmento.split("_");
		return (partes[partes.length - 1]).toLowerCase();
	}

	getUltimoCodigoSegmentoRetorno(){
		const layout = this.getRetornoLayout();
		const segmentos = Object.keys(layout['detalhes']);
		const ultimoSegmento = segmentos[segmentos.length - 1];
		const partes = ultimoSegmento.split("_");
		return (partes[partes.length - 1]).toLowerCase();
	}
}