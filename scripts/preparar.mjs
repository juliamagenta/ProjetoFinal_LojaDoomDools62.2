// Copia os arquivos públicos para a pasta usada na hospedagem.
// O projeto continua funcionando ao abrir index.html, sem executar este script.
import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const raiz = fileURLToPath(new URL('..', import.meta.url));
const destino = path.join(raiz, 'dist');
await mkdir(destino, { recursive: true });
for (const nome of ['index.html', 'css', 'js', 'assets']) {
  await cp(path.join(raiz, nome), path.join(destino, nome), { recursive: true });
}
console.log('Arquivos públicos preparados em dist/.');
