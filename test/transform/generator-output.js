import test from 'ava';
import getStream, {getStreamAsArray} from 'get-stream';
import {execa, execaSync} from '../../index.js';
import {setFixtureDirectory} from '../helpers/fixtures-directory.js';
import {getStdio} from '../helpers/stdio.js';
import {foobarString, foobarUppercase, foobarObject} from '../helpers/input.js';
import {generatorsMap} from '../helpers/map.js';

setFixtureDirectory();

const getOutputObjectMode = (objectMode, addNoopTransform, type, binary) => objectMode
	? {
		generators: generatorsMap[type].addNoop(generatorsMap[type].outputObject(), addNoopTransform, objectMode, binary),
		output: [foobarObject],
		getStreamMethod: getStreamAsArray,
	}
	: {
		generators: generatorsMap[type].addNoop(generatorsMap[type].uppercaseBuffer(objectMode, true), addNoopTransform, objectMode, binary),
		output: foobarUppercase,
		getStreamMethod: getStream,
	};

// eslint-disable-next-line max-params
const testGeneratorOutput = async (t, fdNumber, reject, useShortcutProperty, objectMode, addNoopTransform, type, execaMethod) => {
	const {generators, output} = getOutputObjectMode(objectMode, addNoopTransform, type);
	const fixtureName = reject ? 'noop-fd.js' : 'noop-fail.js';
	const {stdout, stderr, stdio} = await execaMethod(fixtureName, [`${fdNumber}`, foobarString], {...getStdio(fdNumber, generators), reject});
	const result = useShortcutProperty ? [stdout, stderr][fdNumber - 1] : stdio[fdNumber];
	t.deepEqual(result, output);
};

test('Can use generators with result.stdio[1]', testGeneratorOutput, 1, true, false, false, false, 'generator', execa);
test('Can use generators with result.stdout', testGeneratorOutput, 1, true, true, false, false, 'generator', execa);
test('Can use generators with result.stdio[2]', testGeneratorOutput, 2, true, false, false, false, 'generator', execa);
test('Can use generators with result.stderr', testGeneratorOutput, 2, true, true, false, false, 'generator', execa);
test('Can use generators with result.stdio[*] as output', testGeneratorOutput, 3, true, false, false, false, 'generator', execa);
test('Can use generators with error.stdio[1]', testGeneratorOutput, 1, false, false, false, false, 'generator', execa);
test('Can use generators with error.stdout', testGeneratorOutput, 1, false, true, false, false, 'generator', execa);
test('Can use generators with error.stdio[2]', testGeneratorOutput, 2, false, false, false, false, 'generator', execa);
test('Can use generators with error.stderr', testGeneratorOutput, 2, false, true, false, false, 'generator', execa);
test('Can use generators with error.stdio[*] as output', testGeneratorOutput, 3, false, false, false, false, 'generator', execa);
test('Can use generators with result.stdio[1], objectMode', testGeneratorOutput, 1, true, false, true, false, 'generator', execa);
test('Can use generators with result.stdout, objectMode', testGeneratorOutput, 1, true, true, true, false, 'generator', execa);
test('Can use generators with result.stdio[2], objectMode', testGeneratorOutput, 2, true, false, true, false, 'generator', execa);
test('Can use generators with result.stderr, objectMode', testGeneratorOutput, 2, true, true, true, false, 'generator', execa);
test('Can use generators with result.stdio[*] as output, objectMode', testGeneratorOutput, 3, true, false, true, false, 'generator', execa);
test('Can use generators with error.stdio[1], objectMode', testGeneratorOutput, 1, false, false, true, false, 'generator', execa);
test('Can use generators with error.stdout, objectMode', testGeneratorOutput, 1, false, true, true, false, 'generator', execa);
test('Can use generators with error.stdio[2], objectMode', testGeneratorOutput, 2, false, false, true, false, 'generator', execa);
test('Can use generators with error.stderr, objectMode', testGeneratorOutput, 2, false, true, true, false, 'generator', execa);
test('Can use generators with error.stdio[*] as output, objectMode', testGeneratorOutput, 3, false, false, true, false, 'generator', execa);
test('Can use generators with result.stdio[1], noop transform', testGeneratorOutput, 1, true, false, false, true, 'generator', execa);
test('Can use generators with result.stdout, noop transform', testGeneratorOutput, 1, true, true, false, true, 'generator', execa);
test('Can use generators with result.stdio[2], noop transform', testGeneratorOutput, 2, true, false, false, true, 'generator', execa);
test('Can use generators with result.stderr, noop transform', testGeneratorOutput, 2, true, true, false, true, 'generator', execa);
test('Can use generators with result.stdio[*] as output, noop transform', testGeneratorOutput, 3, true, false, false, true, 'generator', execa);
test('Can use generators with error.stdio[1], noop transform', testGeneratorOutput, 1, false, false, false, true, 'generator', execa);
test('Can use generators with error.stdout, noop transform', testGeneratorOutput, 1, false, true, false, true, 'generator', execa);
test('Can use generators with error.stdio[2], noop transform', testGeneratorOutput, 2, false, false, false, true, 'generator', execa);
test('Can use generators with error.stderr, noop transform', testGeneratorOutput, 2, false, true, false, true, 'generator', execa);
test('Can use generators with error.stdio[*] as output, noop transform', testGeneratorOutput, 3, false, false, false, true, 'generator', execa);
test('Can use generators with result.stdio[1], objectMode, noop transform', testGeneratorOutput, 1, true, false, true, true, 'generator', execa);
test('Can use generators with result.stdout, objectMode, noop transform', testGeneratorOutput, 1, true, true, true, true, 'generator', execa);
test('Can use generators with result.stdio[2], objectMode, noop transform', testGeneratorOutput, 2, true, false, true, true, 'generator', execa);
test('Can use generators with result.stderr, objectMode, noop transform', testGeneratorOutput, 2, true, true, true, true, 'generator', execa);
test('Can use generators with result.stdio[*] as output, objectMode, noop transform', testGeneratorOutput, 3, true, false, true, true, 'generator', execa);
test('Can use generators with error.stdio[1], objectMode, noop transform', testGeneratorOutput, 1, false, false, true, true, 'generator', execa);
test('Can use generators with error.stdout, objectMode, noop transform', testGeneratorOutput, 1, false, true, true, true, 'generator', execa);
test('Can use generators with error.stdio[2], objectMode, noop transform', testGeneratorOutput, 2, false, false, true, true, 'generator', execa);
test('Can use generators with error.stderr, objectMode, noop transform', testGeneratorOutput, 2, false, true, true, true, 'generator', execa);
test('Can use generators with error.stdio[*] as output, objectMode, noop transform', testGeneratorOutput, 3, false, false, true, true, 'generator', execa);
test('Can use generators with result.stdio[1], sync', testGeneratorOutput, 1, true, false, false, false, 'generator', execaSync);
test('Can use generators with result.stdout, sync', testGeneratorOutput, 1, true, true, false, false, 'generator', execaSync);
test('Can use generators with result.stdio[2], sync', testGeneratorOutput, 2, true, false, false, false, 'generator', execaSync);
test('Can use generators with result.stderr, sync', testGeneratorOutput, 2, true, true, false, false, 'generator', execaSync);
test('Can use generators with result.stdio[*] as output, sync', testGeneratorOutput, 3, true, false, false, false, 'generator', execaSync);
test('Can use generators with error.stdio[1], sync', testGeneratorOutput, 1, false, false, false, false, 'generator', execaSync);
test('Can use generators with error.stdout, sync', testGeneratorOutput, 1, false, true, false, false, 'generator', execaSync);
test('Can use generators with error.stdio[2], sync', testGeneratorOutput, 2, false, false, false, false, 'generator', execaSync);
test('Can use generators with error.stderr, sync', testGeneratorOutput, 2, false, true, false, false, 'generator', execaSync);
test('Can use generators with error.stdio[*] as output, sync', testGeneratorOutput, 3, false, false, false, false, 'generator', execaSync);
test('Can use generators with result.stdio[1], objectMode, sync', testGeneratorOutput, 1, true, false, true, false, 'generator', execaSync);
test('Can use generators with result.stdout, objectMode, sync', testGeneratorOutput, 1, true, true, true, false, 'generator', execaSync);
test('Can use generators with result.stdio[2], objectMode, sync', testGeneratorOutput, 2, true, false, true, false, 'generator', execaSync);
test('Can use generators with result.stderr, objectMode, sync', testGeneratorOutput, 2, true, true, true, false, 'generator', execaSync);
test('Can use generators with result.stdio[*] as output, objectMode, sync', testGeneratorOutput, 3, true, false, true, false, 'generator', execaSync);
test('Can use generators with error.stdio[1], objectMode, sync', testGeneratorOutput, 1, false, false, true, false, 'generator', execaSync);
test('Can use generators with error.stdout, objectMode, sync', testGeneratorOutput, 1, false, true, true, false, 'generator', execaSync);
test('Can use generators with error.stdio[2], objectMode, sync', testGeneratorOutput, 2, false, false, true, false, 'generator', execaSync);
test('Can use generators with error.stderr, objectMode, sync', testGeneratorOutput, 2, false, true, true, false, 'generator', execaSync);
test('Can use generators with error.stdio[*] as output, objectMode, sync', testGeneratorOutput, 3, false, false, true, false, 'generator', execaSync);
test('Can use generators with result.stdio[1], noop transform, sync', testGeneratorOutput, 1, true, false, false, true, 'generator', execaSync);
test('Can use generators with result.stdout, noop transform, sync', testGeneratorOutput, 1, true, true, false, true, 'generator', execaSync);
test('Can use generators with result.stdio[2], noop transform, sync', testGeneratorOutput, 2, true, false, false, true, 'generator', execaSync);
test('Can use generators with result.stderr, noop transform, sync', testGeneratorOutput, 2, true, true, false, true, 'generator', execaSync);
test('Can use generators with result.stdio[*] as output, noop transform, sync', testGeneratorOutput, 3, true, false, false, true, 'generator', execaSync);
test('Can use generators with error.stdio[1], noop transform, sync', testGeneratorOutput, 1, false, false, false, true, 'generator', execaSync);
test('Can use generators with error.stdout, noop transform, sync', testGeneratorOutput, 1, false, true, false, true, 'generator', execaSync);
test('Can use generators with error.stdio[2], noop transform, sync', testGeneratorOutput, 2, false, false, false, true, 'generator', execaSync);
test('Can use generators with error.stderr, noop transform, sync', testGeneratorOutput, 2, false, true, false, true, 'generator', execaSync);
test('Can use generators with error.stdio[*] as output, noop transform, sync', testGeneratorOutput, 3, false, false, false, true, 'generator', execaSync);
test('Can use generators with result.stdio[1], objectMode, noop transform, sync', testGeneratorOutput, 1, true, false, true, true, 'generator', execaSync);
test('Can use generators with result.stdout, objectMode, noop transform, sync', testGeneratorOutput, 1, true, true, true, true, 'generator', execaSync);
test('Can use generators with result.stdio[2], objectMode, noop transform, sync', testGeneratorOutput, 2, true, false, true, true, 'generator', execaSync);
test('Can use generators with result.stderr, objectMode, noop transform, sync', testGeneratorOutput, 2, true, true, true, true, 'generator', execaSync);
test('Can use generators with result.stdio[*] as output, objectMode, noop transform, sync', testGeneratorOutput, 3, true, false, true, true, 'generator', execaSync);
test('Can use generators with error.stdio[1], objectMode, noop transform, sync', testGeneratorOutput, 1, false, false, true, true, 'generator', execaSync);
test('Can use generators with error.stdout, objectMode, noop transform, sync', testGeneratorOutput, 1, false, true, true, true, 'generator', execaSync);
test('Can use generators with error.stdio[2], objectMode, noop transform, sync', testGeneratorOutput, 2, false, false, true, true, 'generator', execaSync);
test('Can use generators with error.stderr, objectMode, noop transform, sync', testGeneratorOutput, 2, false, true, true, true, 'generator', execaSync);
test('Can use generators with error.stdio[*] as output, objectMode, noop transform, sync', testGeneratorOutput, 3, false, false, true, true, 'generator', execaSync);
test('Can use duplexes with result.stdio[1]', testGeneratorOutput, 1, true, false, false, false, 'duplex', execa);
test('Can use duplexes with result.stdout', testGeneratorOutput, 1, true, true, false, false, 'duplex', execa);
test('Can use duplexes with result.stdio[2]', testGeneratorOutput, 2, true, false, false, false, 'duplex', execa);
test('Can use duplexes with result.stderr', testGeneratorOutput, 2, true, true, false, false, 'duplex', execa);
test('Can use duplexes with result.stdio[*] as output', testGeneratorOutput, 3, true, false, false, false, 'duplex', execa);
test('Can use duplexes with error.stdio[1]', testGeneratorOutput, 1, false, false, false, false, 'duplex', execa);
test('Can use duplexes with error.stdout', testGeneratorOutput, 1, false, true, false, false, 'duplex', execa);
test('Can use duplexes with error.stdio[2]', testGeneratorOutput, 2, false, false, false, false, 'duplex', execa);
test('Can use duplexes with error.stderr', testGeneratorOutput, 2, false, true, false, false, 'duplex', execa);
test('Can use duplexes with error.stdio[*] as output', testGeneratorOutput, 3, false, false, false, false, 'duplex', execa);
test('Can use duplexes with result.stdio[1], objectMode', testGeneratorOutput, 1, true, false, true, false, 'duplex', execa);
test('Can use duplexes with result.stdout, objectMode', testGeneratorOutput, 1, true, true, true, false, 'duplex', execa);
test('Can use duplexes with result.stdio[2], objectMode', testGeneratorOutput, 2, true, false, true, false, 'duplex', execa);
test('Can use duplexes with result.stderr, objectMode', testGeneratorOutput, 2, true, true, true, false, 'duplex', execa);
test('Can use duplexes with result.stdio[*] as output, objectMode', testGeneratorOutput, 3, true, false, true, false, 'duplex', execa);
test('Can use duplexes with error.stdio[1], objectMode', testGeneratorOutput, 1, false, false, true, false, 'duplex', execa);
test('Can use duplexes with error.stdout, objectMode', testGeneratorOutput, 1, false, true, true, false, 'duplex', execa);
test('Can use duplexes with error.stdio[2], objectMode', testGeneratorOutput, 2, false, false, true, false, 'duplex', execa);
test('Can use duplexes with error.stderr, objectMode', testGeneratorOutput, 2, false, true, true, false, 'duplex', execa);
test('Can use duplexes with error.stdio[*] as output, objectMode', testGeneratorOutput, 3, false, false, true, false, 'duplex', execa);
test('Can use duplexes with result.stdio[1], noop transform', testGeneratorOutput, 1, true, false, false, true, 'duplex', execa);
test('Can use duplexes with result.stdout, noop transform', testGeneratorOutput, 1, true, true, false, true, 'duplex', execa);
test('Can use duplexes with result.stdio[2], noop transform', testGeneratorOutput, 2, true, false, false, true, 'duplex', execa);
test('Can use duplexes with result.stderr, noop transform', testGeneratorOutput, 2, true, true, false, true, 'duplex', execa);
test('Can use duplexes with result.stdio[*] as output, noop transform', testGeneratorOutput, 3, true, false, false, true, 'duplex', execa);
test('Can use duplexes with error.stdio[1], noop transform', testGeneratorOutput, 1, false, false, false, true, 'duplex', execa);
test('Can use duplexes with error.stdout, noop transform', testGeneratorOutput, 1, false, true, false, true, 'duplex', execa);
test('Can use duplexes with error.stdio[2], noop transform', testGeneratorOutput, 2, false, false, false, true, 'duplex', execa);
test('Can use duplexes with error.stderr, noop transform', testGeneratorOutput, 2, false, true, false, true, 'duplex', execa);
test('Can use duplexes with error.stdio[*] as output, noop transform', testGeneratorOutput, 3, false, false, false, true, 'duplex', execa);
test('Can use duplexes with result.stdio[1], objectMode, noop transform', testGeneratorOutput, 1, true, false, true, true, 'duplex', execa);
test('Can use duplexes with result.stdout, objectMode, noop transform', testGeneratorOutput, 1, true, true, true, true, 'duplex', execa);
test('Can use duplexes with result.stdio[2], objectMode, noop transform', testGeneratorOutput, 2, true, false, true, true, 'duplex', execa);
test('Can use duplexes with result.stderr, objectMode, noop transform', testGeneratorOutput, 2, true, true, true, true, 'duplex', execa);
test('Can use duplexes with result.stdio[*] as output, objectMode, noop transform', testGeneratorOutput, 3, true, false, true, true, 'duplex', execa);
test('Can use duplexes with error.stdio[1], objectMode, noop transform', testGeneratorOutput, 1, false, false, true, true, 'duplex', execa);
test('Can use duplexes with error.stdout, objectMode, noop transform', testGeneratorOutput, 1, false, true, true, true, 'duplex', execa);
test('Can use duplexes with error.stdio[2], objectMode, noop transform', testGeneratorOutput, 2, false, false, true, true, 'duplex', execa);
test('Can use duplexes with error.stderr, objectMode, noop transform', testGeneratorOutput, 2, false, true, true, true, 'duplex', execa);
test('Can use duplexes with error.stdio[*] as output, objectMode, noop transform', testGeneratorOutput, 3, false, false, true, true, 'duplex', execa);
test('Can use webTransforms with result.stdio[1]', testGeneratorOutput, 1, true, false, false, false, 'webTransform', execa);
test('Can use webTransforms with result.stdout', testGeneratorOutput, 1, true, true, false, false, 'webTransform', execa);
test('Can use webTransforms with result.stdio[2]', testGeneratorOutput, 2, true, false, false, false, 'webTransform', execa);
test('Can use webTransforms with result.stderr', testGeneratorOutput, 2, true, true, false, false, 'webTransform', execa);
test('Can use webTransforms with result.stdio[*] as output', testGeneratorOutput, 3, true, false, false, false, 'webTransform', execa);
test('Can use webTransforms with error.stdio[1]', testGeneratorOutput, 1, false, false, false, false, 'webTransform', execa);
test('Can use webTransforms with error.stdout', testGeneratorOutput, 1, false, true, false, false, 'webTransform', execa);
test('Can use webTransforms with error.stdio[2]', testGeneratorOutput, 2, false, false, false, false, 'webTransform', execa);
test('Can use webTransforms with error.stderr', testGeneratorOutput, 2, false, true, false, false, 'webTransform', execa);
test('Can use webTransforms with error.stdio[*] as output', testGeneratorOutput, 3, false, false, false, false, 'webTransform', execa);
test('Can use webTransforms with result.stdio[1], objectMode', testGeneratorOutput, 1, true, false, true, false, 'webTransform', execa);
test('Can use webTransforms with result.stdout, objectMode', testGeneratorOutput, 1, true, true, true, false, 'webTransform', execa);
test('Can use webTransforms with result.stdio[2], objectMode', testGeneratorOutput, 2, true, false, true, false, 'webTransform', execa);
test('Can use webTransforms with result.stderr, objectMode', testGeneratorOutput, 2, true, true, true, false, 'webTransform', execa);
test('Can use webTransforms with result.stdio[*] as output, objectMode', testGeneratorOutput, 3, true, false, true, false, 'webTransform', execa);
test('Can use webTransforms with error.stdio[1], objectMode', testGeneratorOutput, 1, false, false, true, false, 'webTransform', execa);
test('Can use webTransforms with error.stdout, objectMode', testGeneratorOutput, 1, false, true, true, false, 'webTransform', execa);
test('Can use webTransforms with error.stdio[2], objectMode', testGeneratorOutput, 2, false, false, true, false, 'webTransform', execa);
test('Can use webTransforms with error.stderr, objectMode', testGeneratorOutput, 2, false, true, true, false, 'webTransform', execa);
test('Can use webTransforms with error.stdio[*] as output, objectMode', testGeneratorOutput, 3, false, false, true, false, 'webTransform', execa);
test('Can use webTransforms with result.stdio[1], noop transform', testGeneratorOutput, 1, true, false, false, true, 'webTransform', execa);
test('Can use webTransforms with result.stdout, noop transform', testGeneratorOutput, 1, true, true, false, true, 'webTransform', execa);
test('Can use webTransforms with result.stdio[2], noop transform', testGeneratorOutput, 2, true, false, false, true, 'webTransform', execa);
test('Can use webTransforms with result.stderr, noop transform', testGeneratorOutput, 2, true, true, false, true, 'webTransform', execa);
test('Can use webTransforms with result.stdio[*] as output, noop transform', testGeneratorOutput, 3, true, false, false, true, 'webTransform', execa);
test('Can use webTransforms with error.stdio[1], noop transform', testGeneratorOutput, 1, false, false, false, true, 'webTransform', execa);
test('Can use webTransforms with error.stdout, noop transform', testGeneratorOutput, 1, false, true, false, true, 'webTransform', execa);
test('Can use webTransforms with error.stdio[2], noop transform', testGeneratorOutput, 2, false, false, false, true, 'webTransform', execa);
test('Can use webTransforms with error.stderr, noop transform', testGeneratorOutput, 2, false, true, false, true, 'webTransform', execa);
test('Can use webTransforms with error.stdio[*] as output, noop transform', testGeneratorOutput, 3, false, false, false, true, 'webTransform', execa);
test('Can use webTransforms with result.stdio[1], objectMode, noop transform', testGeneratorOutput, 1, true, false, true, true, 'webTransform', execa);
test('Can use webTransforms with result.stdout, objectMode, noop transform', testGeneratorOutput, 1, true, true, true, true, 'webTransform', execa);
test('Can use webTransforms with result.stdio[2], objectMode, noop transform', testGeneratorOutput, 2, true, false, true, true, 'webTransform', execa);
test('Can use webTransforms with result.stderr, objectMode, noop transform', testGeneratorOutput, 2, true, true, true, true, 'webTransform', execa);
test('Can use webTransforms with result.stdio[*] as output, objectMode, noop transform', testGeneratorOutput, 3, true, false, true, true, 'webTransform', execa);
test('Can use webTransforms with error.stdio[1], objectMode, noop transform', testGeneratorOutput, 1, false, false, true, true, 'webTransform', execa);
test('Can use webTransforms with error.stdout, objectMode, noop transform', testGeneratorOutput, 1, false, true, true, true, 'webTransform', execa);
test('Can use webTransforms with error.stdio[2], objectMode, noop transform', testGeneratorOutput, 2, false, false, true, true, 'webTransform', execa);
test('Can use webTransforms with error.stderr, objectMode, noop transform', testGeneratorOutput, 2, false, true, true, true, 'webTransform', execa);
test('Can use webTransforms with error.stdio[*] as output, objectMode, noop transform', testGeneratorOutput, 3, false, false, true, true, 'webTransform', execa);

// eslint-disable-next-line max-params
const testGeneratorOutputPipe = async (t, fdNumber, useShortcutProperty, objectMode, addNoopTransform, type) => {
	const {generators, output, getStreamMethod} = getOutputObjectMode(objectMode, addNoopTransform, type, true);
	const subprocess = execa('noop-fd.js', [`${fdNumber}`, foobarString], getStdio(fdNumber, generators));
	const stream = useShortcutProperty ? [subprocess.stdout, subprocess.stderr][fdNumber - 1] : subprocess.stdio[fdNumber];
	const [result] = await Promise.all([getStreamMethod(stream), subprocess]);
	t.deepEqual(result, output);
};

test('Can use generators with subprocess.stdio[1]', testGeneratorOutputPipe, 1, false, false, false, 'generator');
test('Can use generators with subprocess.stdout', testGeneratorOutputPipe, 1, true, false, false, 'generator');
test('Can use generators with subprocess.stdio[2]', testGeneratorOutputPipe, 2, false, false, false, 'generator');
test('Can use generators with subprocess.stderr', testGeneratorOutputPipe, 2, true, false, false, 'generator');
test('Can use generators with subprocess.stdio[*] as output', testGeneratorOutputPipe, 3, false, false, false, 'generator');
test('Can use generators with subprocess.stdio[1], objectMode', testGeneratorOutputPipe, 1, false, true, false, 'generator');
test('Can use generators with subprocess.stdout, objectMode', testGeneratorOutputPipe, 1, true, true, false, 'generator');
test('Can use generators with subprocess.stdio[2], objectMode', testGeneratorOutputPipe, 2, false, true, false, 'generator');
test('Can use generators with subprocess.stderr, objectMode', testGeneratorOutputPipe, 2, true, true, false, 'generator');
test('Can use generators with subprocess.stdio[*] as output, objectMode', testGeneratorOutputPipe, 3, false, true, false, 'generator');
test('Can use generators with subprocess.stdio[1], noop transform', testGeneratorOutputPipe, 1, false, false, true, 'generator');
test('Can use generators with subprocess.stdout, noop transform', testGeneratorOutputPipe, 1, true, false, true, 'generator');
test('Can use generators with subprocess.stdio[2], noop transform', testGeneratorOutputPipe, 2, false, false, true, 'generator');
test('Can use generators with subprocess.stderr, noop transform', testGeneratorOutputPipe, 2, true, false, true, 'generator');
test('Can use generators with subprocess.stdio[*] as output, noop transform', testGeneratorOutputPipe, 3, false, false, true, 'generator');
test('Can use generators with subprocess.stdio[1], objectMode, noop transform', testGeneratorOutputPipe, 1, false, true, true, 'generator');
test('Can use generators with subprocess.stdout, objectMode, noop transform', testGeneratorOutputPipe, 1, true, true, true, 'generator');
test('Can use generators with subprocess.stdio[2], objectMode, noop transform', testGeneratorOutputPipe, 2, false, true, true, 'generator');
test('Can use generators with subprocess.stderr, objectMode, noop transform', testGeneratorOutputPipe, 2, true, true, true, 'generator');
test('Can use generators with subprocess.stdio[*] as output, objectMode, noop transform', testGeneratorOutputPipe, 3, false, true, true, 'generator');
test('Can use duplexes with subprocess.stdio[1]', testGeneratorOutputPipe, 1, false, false, false, 'duplex');
test('Can use duplexes with subprocess.stdout', testGeneratorOutputPipe, 1, true, false, false, 'duplex');
test('Can use duplexes with subprocess.stdio[2]', testGeneratorOutputPipe, 2, false, false, false, 'duplex');
test('Can use duplexes with subprocess.stderr', testGeneratorOutputPipe, 2, true, false, false, 'duplex');
test('Can use duplexes with subprocess.stdio[*] as output', testGeneratorOutputPipe, 3, false, false, false, 'duplex');
test('Can use duplexes with subprocess.stdio[1], objectMode', testGeneratorOutputPipe, 1, false, true, false, 'duplex');
test('Can use duplexes with subprocess.stdout, objectMode', testGeneratorOutputPipe, 1, true, true, false, 'duplex');
test('Can use duplexes with subprocess.stdio[2], objectMode', testGeneratorOutputPipe, 2, false, true, false, 'duplex');
test('Can use duplexes with subprocess.stderr, objectMode', testGeneratorOutputPipe, 2, true, true, false, 'duplex');
test('Can use duplexes with subprocess.stdio[*] as output, objectMode', testGeneratorOutputPipe, 3, false, true, false, 'duplex');
test('Can use duplexes with subprocess.stdio[1], noop transform', testGeneratorOutputPipe, 1, false, false, true, 'duplex');
test('Can use duplexes with subprocess.stdout, noop transform', testGeneratorOutputPipe, 1, true, false, true, 'duplex');
test('Can use duplexes with subprocess.stdio[2], noop transform', testGeneratorOutputPipe, 2, false, false, true, 'duplex');
test('Can use duplexes with subprocess.stderr, noop transform', testGeneratorOutputPipe, 2, true, false, true, 'duplex');
test('Can use duplexes with subprocess.stdio[*] as output, noop transform', testGeneratorOutputPipe, 3, false, false, true, 'duplex');
test('Can use duplexes with subprocess.stdio[1], objectMode, noop transform', testGeneratorOutputPipe, 1, false, true, true, 'duplex');
test('Can use duplexes with subprocess.stdout, objectMode, noop transform', testGeneratorOutputPipe, 1, true, true, true, 'duplex');
test('Can use duplexes with subprocess.stdio[2], objectMode, noop transform', testGeneratorOutputPipe, 2, false, true, true, 'duplex');
test('Can use duplexes with subprocess.stderr, objectMode, noop transform', testGeneratorOutputPipe, 2, true, true, true, 'duplex');
test('Can use duplexes with subprocess.stdio[*] as output, objectMode, noop transform', testGeneratorOutputPipe, 3, false, true, true, 'duplex');
test('Can use webTransforms with subprocess.stdio[1]', testGeneratorOutputPipe, 1, false, false, false, 'webTransform');
test('Can use webTransforms with subprocess.stdout', testGeneratorOutputPipe, 1, true, false, false, 'webTransform');
test('Can use webTransforms with subprocess.stdio[2]', testGeneratorOutputPipe, 2, false, false, false, 'webTransform');
test('Can use webTransforms with subprocess.stderr', testGeneratorOutputPipe, 2, true, false, false, 'webTransform');
test('Can use webTransforms with subprocess.stdio[*] as output', testGeneratorOutputPipe, 3, false, false, false, 'webTransform');
test('Can use webTransforms with subprocess.stdio[1], objectMode', testGeneratorOutputPipe, 1, false, true, false, 'webTransform');
test('Can use webTransforms with subprocess.stdout, objectMode', testGeneratorOutputPipe, 1, true, true, false, 'webTransform');
test('Can use webTransforms with subprocess.stdio[2], objectMode', testGeneratorOutputPipe, 2, false, true, false, 'webTransform');
test('Can use webTransforms with subprocess.stderr, objectMode', testGeneratorOutputPipe, 2, true, true, false, 'webTransform');
test('Can use webTransforms with subprocess.stdio[*] as output, objectMode', testGeneratorOutputPipe, 3, false, true, false, 'webTransform');
test('Can use webTransforms with subprocess.stdio[1], noop transform', testGeneratorOutputPipe, 1, false, false, true, 'webTransform');
test('Can use webTransforms with subprocess.stdout, noop transform', testGeneratorOutputPipe, 1, true, false, true, 'webTransform');
test('Can use webTransforms with subprocess.stdio[2], noop transform', testGeneratorOutputPipe, 2, false, false, true, 'webTransform');
test('Can use webTransforms with subprocess.stderr, noop transform', testGeneratorOutputPipe, 2, true, false, true, 'webTransform');
test('Can use webTransforms with subprocess.stdio[*] as output, noop transform', testGeneratorOutputPipe, 3, false, false, true, 'webTransform');
test('Can use webTransforms with subprocess.stdio[1], objectMode, noop transform', testGeneratorOutputPipe, 1, false, true, true, 'webTransform');
test('Can use webTransforms with subprocess.stdout, objectMode, noop transform', testGeneratorOutputPipe, 1, true, true, true, 'webTransform');
test('Can use webTransforms with subprocess.stdio[2], objectMode, noop transform', testGeneratorOutputPipe, 2, false, true, true, 'webTransform');
test('Can use webTransforms with subprocess.stderr, objectMode, noop transform', testGeneratorOutputPipe, 2, true, true, true, 'webTransform');
test('Can use webTransforms with subprocess.stdio[*] as output, objectMode, noop transform', testGeneratorOutputPipe, 3, false, true, true, 'webTransform');
