from selenium import webdriver
import unittest


class ServerDriverTest(unittest.TestCase):

    def test_server(self):
        print "TESTING SERVER"

        driver = webdriver.Firefox()
        driver.get('http://localhost:8080/')

        self.assertEqual(driver.title, '__SERVER__', 'Wrong page accessed')

        page = driver.find_element_by_tag_name('body').text

        assert "Create" in page
        assert "Read" in page
        assert "Update" in page
        assert "Delete" in page

    def test_server_data(self):
        print "TESTING SERVER DATA"

        driver = webdriver.Firefox()
        driver.get('http://localhost:8080/ServerData')

        page = driver.find_element_by_tag_name('body').text
        assert "info" in page


if __name__ == '__main__':
    unittest.main()
