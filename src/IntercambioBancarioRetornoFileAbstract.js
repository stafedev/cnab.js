namespace CnabParser;

use CnabParser\Parser\Layout;
use CnabParser\Model\Linha;
use CnabParser\Model\Retorno;
use CnabParser\Format\Picture;

abstract class IntercambioBancarioRetornoFileAbstract extends IntercambioBancarioFileAbstract
{
	// Para CNAB240
	const REGISTRO_HEADER_ARQUIVO = 0;
	const REGISTRO_HEADER_LOTE = 1;
	const REGISTRO_DETALHES = 3;
	const REGISTRO_TRAILER_LOTE = 5;
	const REGISTRO_TRAILER_ARQUIVO = 9;

	// Para CNAB400

	/**
	 * @var CnabParser\Parser\Layout
	 */
	protected $layout;

	protected $path;

	protected $linhas;

	/**
	 * Total de lotes em um arquivo
	 * @var integer
	 */
	protected $totalLotes;

	/**
	 * [__construct description]
	 * @param Layout $layout Layout do retorno
	 * @param string $path   Caminho do arquivo de retorno a ser processado
	 */
	public function __construct(Layout $layout, $path)
	{
		$this->layout = $layout;
		$this->path = $path;

		$this->linhas = file($this->path, FILE_IGNORE_NEW_LINES);
		if (false === $this->linhas) {
			throw new RetornoException('Falha ao ler linhas do arquivo de retorno "'.$this->path.'".');
		}

		$this->calculaTotalLotes();

		$this->model = new Retorno();
	}

	public function getTotalLotes()
	{
		return $this->totalLotes;
	}

	protected function calculaTotalLotes()
	{
		$this->totalLotes = 1;

		$layout = $this->layout->getLayout();

		$linhaTrailerArquivoStr = $this->linhas[count($this->linhas) - 1];
		$linha = new Linha($linhaTrailerArquivoStr, $this->layout, 'retorno');

		if (strtoupper($layout) === strtoupper('cnab240')) {
			// conforme cnab240 febraban
			$definicao = array(
				'pos' => array(18, 23),
				'picture' => '9(6)'
			);
			$this->totalLotes = (int)$linha->obterValorCampo($definicao);
		} elseif (strtoupper($layout) === strtoupper('cnab400')) {
			$this->totalLotes = 1; // cnab400 apenas 1 lote
		}

		return $this->totalLotes;
	}
}