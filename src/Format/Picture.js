const timeFormater = (format, time) => {
    throw new Error('Foi mal Kuma, não tankei implementar essa, mas eh baseado na strftime do php.');
}

export default class Picture
{
    REGEX_VALID_FORMAT = /(?P<tipo1>X|9)\((?P<tamanho1>[0-9]+)\)(?P<tipo2>(V9)?)\(?(?P<tamanho2>([0-9]+)?)\)?\\/;

    static validarFormato(format){
        return this.REGEX_VALID_FORMAT.test(format);
    }

    static getLength(format){
        return format.match(this.REGEX_VALID_FORMAT) || new Error(`'${format}' is not a valid format`);
    }

    static parseNumber(value){
        let res = value.replaceAll(/[^0-9.]/, '');
        res = res.replaceAll(/^0+/, '');
        return res?res:0;
    }

    static encode(value, format, options)
    {
        let m = [];
        let res;
        let msg;
        if (m = format.match(this.REGEX_VALID_FORMAT)) {
            if (m['tipo1'] == 'X' && !m['tipo2']) {
                res = value.substr(0, m['tamanho1']);
                return [...res, ...Array(m['tamanho1']).fill(' ')].join('');
            } else if (m['tipo1'] == '9') {
                if (value instanceof Date) {
                    if (options['date_format']) {
                        res = timeFormater(options['date_format'], value.getTime());
                    } else {
                        if (m['tamanho1'] == 8) {
                            res = `${value.getDate()}${('0'.concat(str(value.getMonth() + 1))).slice(-2)}${value.getFullYear()}`;
                        }

                        if (m['tamanho1'] == 6) {
                            res = `${value.getDate()}${('0'.concat(str(value.getMonth() + 1))).slice(-2)}${value.getYear() - 100}`; // TODO: rever esse -100 
                        }
                    }
                }

                if (isNaN(value)) {
                    msg = ` valor '${value}' não é número, formato requerido ${format}.`;

                    if (options['register_desc'] === null || options['register_desc'] === undefined || options['register_desc'] === '') {
                        msg = `{$options['register_desc']} > ${options['register_desc']}`.concat(msg);
                    }

                    if (options['field_desc'] === null || options['field_desc'] === undefined || options['field_desc'] === '') {
                        msg = `{$options['field_desc']}: ${options['field_desc']}`.concat(msg);
                    }
                    throw new Error(msg);
                }

                res = this.parseNumber(value);
                let exp = res.split('.');
                if (exp[1] === undefined || exp[1] === null) {
                    exp[1] = 0;
                }
                if (m['tipo2'] == 'V9') {
                    const tamanho_left = m['tamanho1'];
                    const tamanho_right = m['tamanho2'];
                    const valor_left = [...Array(tamanho_left).fill('0'), ...exp[0]].join('');
                    if (exp[1].length > tamanho_right) {
                        const extra = exp[1].length - tamanho_right;
                        const extraPow = Math.pow(10, extra);
                        exp[1] = Math.round(exp[1] / extraPow);
                    }
                    const valor_right = [...exp[1], ...Array(tamanho_right).fill('0')].join('');

                    return `${valor_left}${valor_right}`;
                } else if (m['tipo2']) {
                    res = this.parseNumber(value);
                    return [...Array(m['tamanho1']).fill('0'), ...res].join('');
                } else {
                    msg = ` '${format}' is not a valid format`;

                    if (!empty(@$options['register_desc'])) {
                        $msg = sprintf($msg, "{$options['register_desc']} > %s");
                    }

                    if (!empty(@$options['field_desc'])) {
                        $msg = sprintf($msg, "{$options['field_desc']}: ");
                    }
                    throw new \InvalidArgumentException($msg);
                }
            }
        } else {
            throw new \InvalidArgumentException("'$format' is not a valid format");
        }
    }

    public static function decode($value, $format, $options)
    {
        $m = array();
        if (preg_match(self::REGEX_VALID_FORMAT, $format, $m)) {
            if ($m['tipo1'] == 'X' && !$m['tipo2']) {
                return rtrim($value);
            } elseif ($m['tipo1'] == '9') {
                if ($m['tipo2'] == 'V9') {
                    $tamanho_left = (int) $m['tamanho1'];
                    $tamanho_right = (int) $m['tamanho2'];
                    $valor_left = self::parseNumber(substr($value, 0, $tamanho_left));
                    $valor_right = '0.'.substr($value, $tamanho_left, $tamanho_right);
                    if ((double) $valor_right > 0) {
                        return $valor_left + (double) $valor_right;
                    } else {
                        return self::parseNumber($valor_left);
                    }
                } elseif (!$m['tipo2']) {
                    return self::parseNumber($value);
                } else {
                    $msg = "%s$format' is not a valid format";

                    if (!empty(@$options['field_desc'])) {
                        $msg = sprintf($msg, "{$options['field_desc']}: ");
                    }
                    throw new \InvalidArgumentException($msg);
                }
            }
        } else {
            $msg = "%s$format' is not a valid format";

            if (!empty(@$options['field_desc'])) {
                $msg = sprintf($msg, "{$options['field_desc']}: ");
            }
            throw new \InvalidArgumentException($msg);
        }
    }
}
