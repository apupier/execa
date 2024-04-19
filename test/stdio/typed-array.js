import test from 'ava';
import {execa, execaSync} from '../../index.js';
import {setFixtureDirectory} from '../helpers/fixtures-directory.js';
import {getStdio} from '../helpers/stdio.js';
import {foobarUint8Array, foobarString} from '../helpers/input.js';

setFixtureDirectory();

const testUint8Array = async (t, fdNumber, execaMethod) => {
	const {stdout} = await execaMethod('stdin-fd.js', [`${fdNumber}`], getStdio(fdNumber, foobarUint8Array));
	t.is(stdout, foobarString);
};

test('stdin option can be a Uint8Array', testUint8Array, 0, execa);
test('stdio[*] option can be a Uint8Array', testUint8Array, 3, execa);
test('stdin option can be a Uint8Array - sync', testUint8Array, 0, execaSync);

const testNoUint8ArrayOutput = (t, fdNumber, execaMethod) => {
	t.throws(() => {
		execaMethod('empty.js', getStdio(fdNumber, foobarUint8Array));
	}, {message: /cannot be a Uint8Array/});
};

test('stdout option cannot be a Uint8Array', testNoUint8ArrayOutput, 1, execa);
test('stderr option cannot be a Uint8Array', testNoUint8ArrayOutput, 2, execa);
test('stdout option cannot be a Uint8Array - sync', testNoUint8ArrayOutput, 1, execaSync);
test('stderr option cannot be a Uint8Array - sync', testNoUint8ArrayOutput, 2, execaSync);
