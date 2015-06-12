import unittest
from mock import patch, Mock
from functions import create, update, delete, read


class ServerMockTest(unittest.TestCase):

    @patch('redis.Redis')
    def test_get_data(self, obj):
        a = Mock()
        a.keys.return_value = ["student1", "student2"]
        a.lrange.return_value = ["subject1", "rate1"]

        obj.return_value = a

        self.assertEqual(read(), [['student1', 'student2'], [['subject1', 'rate1'], ['subject1', 'rate1']]])

    @patch('redis.Redis')
    def test_delete(self, obj):
        a = Mock()
        a.lrange.return_value = ["subject1", "rate1"]
        a.delete.return_value = []
        a.rpush.return_value = []

        obj.return_value = a

        self.assertIsNone(delete("student1", "subject1", "rate1"))

    @patch('redis.Redis')
    def test_update(self, obj):
        a = Mock()
        a.rename.return_value = []
        a.lrange.return_value = []
        a.rpush.return_value = []

        obj.return_value = a

        self.assertIsNone(update('', '', '', '', '', ''))

    @patch('redis.Redis')
    def test_create(self, obj):
        a = Mock()
        a.rpush.return_value = []

        obj.return_value = a

        self.assertIsNone(create('', '', ''))


if __name__ == "__main__":
    unittest.main()