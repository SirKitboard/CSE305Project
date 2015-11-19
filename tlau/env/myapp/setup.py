#pylint: disable=C
import os

from setuptools import setup, find_packages

import sass

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.txt')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()

scssPath = here+"/myapp/static/scss/"

cssPath = here+"/myapp/static/css/"

for root, _, files in os.walk(scssPath):
    for f in files:
        fullpath = os.path.join(root, f)
        relativePath = fullpath.split(scssPath)[1]
        css = open(fullpath).read()
        if(len(css.strip()) > 0):
            print("Compiling " + relativePath)
            relativePath = relativePath.replace('scss', 'css')
            newFilePath = cssPath + relativePath
            css = sass.compile(string=css)
            if os.path.isfile(newFilePath):
                os.remove(newFilePath)
            outputFile = open(newFilePath, "w")
            outputFile.write(css)



requires = [
    'pyramid',
    'pyramid_chameleon',
    'pyramid_debugtoolbar',
    'waitress',
    ]

setup(name='myapp',
      version='0.0',
      description='myapp',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        ],
      author='',
      author_email='',
      url='',
      keywords='web pyramid pylons',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      install_requires=requires,
      tests_require=requires,
      test_suite="myapp",
      entry_points="""\
      [paste.app_factory]
      main = myapp:main
      """,
      )
