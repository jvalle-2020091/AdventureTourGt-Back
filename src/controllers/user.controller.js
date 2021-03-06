'use strict'

const User = require('../models/user.model');
const validate = require('../utils/validate');
const jwt = require('../services/jwt');

//FUNCIONES PÚBLICAS

exports.test = async (req, res) => {
    await res.send({ message: 'Controller run' })
}


exports.register = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: 'CLIENT'
        };
        let msg = validate.validateData(data);

        if (msg) return res.status(400).send(msg);
        let already = await validate.alreadyUser(data.username);
        if (already) return res.status(400).send({ message: 'Username already in use' });
        data.phone = params.phone;
        data.password = await validate.encrypt(params.password);

        let user = new User(data);
        await user.save();
        return res.send({ message: 'User created successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error saving user' });
    }
}

exports.login = async (req, res) => {
    try {
        const params = req.body;
        let data = {
            username: params.username,
            password: params.password
        }
        let msg = validate.validateData(data);

        if (msg) return res.status(400).send(msg);
        let already = await validate.alreadyUser(params.username);
        if (already && await validate.checkPassword(data.password, already.password)) {
            let token = await jwt.createToken(already);
            delete already.password;

            return res.send({ token, message: 'Login successfuly', already });
        } else return res.status(401).send({ message: 'Invalid credentials' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Failed to login' });
    }
}

//FUNCIONES PRIVADAS
//-----------------------------------------Clientes -----------------------------------

exports.update = async (req, res) => {
    try {
        const userId = req.user.sub;
        const params = req.body;

        const user = await User.findOne({ _id: userId })
        if (user) {
            const checkUpdated = await validate.checkUpdate(params);
            if (checkUpdated === false) {
                return res.status(400).send({ message: 'Parámetros no válidos para actualizar' })
            } else {
                const checkRole = await User.findOne({ _id: userId })
                if (checkRole.role === 'ADMIN') {
                    return res.status(403).send({ message: 'No puedes editar tu usuario si tienes el rol ADMIN' });
                } else {
                    const checkUser = await validate.alreadyUser(params.username);
                    if (checkUser && user.username != params.username) {
                        return res.status(201).send({ message: 'Este nombre de usuario ya esta en uso' })
                    } else {
                        const updateUser = await User.findOneAndUpdate({ _id: userId }, params, { new: true }).lean();
                        if (!updateUser) {
                            return res.status(403).send({ message: 'No se ha podido actualizar el usuario' })
                        } else {
                            return res.send({ message: 'Usuario actualizado', updateUser })
                        }
                    }
                }
            }
        } else {
            return res.send({ message: 'Este usuario no existe' })
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error actualizando el usuario' });
    }
};

exports.delete = async (req, res) => {
    try {
        const userId = req.user.sub;

        const checkRole = await User.findOne({ _id: userId })
        if (checkRole.role === 'ADMIN') {
            return res.status(403).send({ message: 'No puede eliminar usuarios de rol ADMIN' });
        } else {
            // await rooms.deleteMany({ user: userId })
            const deleteUser = await User.findOneAndDelete({ _id: userId });
            if (!deleteUser) {
                return res.status(500).send({ message: 'Usuario no encontrado' })
            } else {
                return res.send({ message: 'Cuenta eliminada' })
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error eliminando el usuario' });
    }
};

exports.myProfile = async (req, res) => {
    try {
        const userId = req.user.sub;
        const user = await User.findOne({ _id: userId }).lean();
        delete user.password;
        delete user.role;
        delete user.__v
        if (!user) {
            return res.send({ message: 'The entered user could not be found' })
        } else {
            return res.send({ message: 'User:  ', user });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting user' });
    }
};

//FUNCIONES PRIVADAS
//--------------------------------------ADMIN-----------------------------------------

exports.saveUser = async (req, res) => {
    try {
        const params = req.body;
        const data = {
            name: params.name,
            username: params.username,
            email: params.email,
            password: params.password,
            role: params.role
        };
        const msg = validate.validateData(data);
        if (msg) return res.status(400).send(msg);
        const userExist = await validate.alreadyUser(params.username);
        if (userExist) return res.send({ message: 'Username already in use' });
        if (params.role != 'CLIENT' && params.role != 'ADMIN') return res.status(400).send({ message: 'Invalid role' });
        data.phone = params.phoNe;
        data.password = await validate.encrypt(params.password);

        const user = new User(data);
        await user.save();
        return res.send({ message: 'User saved successfully', user });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error saving user' });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const params = req.body;

        const userExist = await User.findOne({ _id: userId });
        if (!userExist) return res.send({ message: 'User not found' });
        const emptyParams = await validate.checkUpdateAdmin(params);
        if (emptyParams === false) return res.status(400).send({ message: 'Empty params or params not update' });
        const alreadyUsername = await User.findOne({ _id: userId, username: params.username });
        if (alreadyUsername && userExist.username != alreadyUsername.username) return res.send({ message: 'Username already taken' });
        if (params.role != 'CLIENT' && params.role != 'ADMIN') return res.status(400).send({ message: 'Invalid role' });
        const userUpdate = await User.findOneAndUpdate({ _id: userId }, params, { new: true });
        if (!userUpdate) return res.status(400).send({ message: 'User not updated' });
        return res.send({ message: 'User updated successfully', userUpdate});

    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error updating user' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const userExist = await User.findOne({ _id: userId });
        if (!userExist) return res.send({ message: 'User not found' });
        
        const userDeleted = await User.findOneAndDelete({ _id: userId });
        if (!userDeleted) return res.status(400).send({ message: 'User not deleted' });
        return res.send({ message: 'Account deleted successfully', userDeleted })
    } catch (err) {
        console.log(err);
        return res.status(500).send({ err, message: 'Error removing account' });
    }
}

exports.getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findOne({ _id: userId });
        console.log(user)
        if (!user) {
            return res.send({ message: 'The entered user could not be found' })
        } else {
            return res.send({user});
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting user' });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const usersExist = await User.find();
        return res.send({message: 'Users:', usersExist})
    } catch (err) {
        console.log(err)
        return res.status(500).send({ message: 'Error getting users' });
    }
};


