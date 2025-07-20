//Mock data for test


module.export ={
    findOne: jest.fn.mockResolvedValue({
        _id: '001',
        username: 'TiaBerry',
        password: 'password123'

    })
};