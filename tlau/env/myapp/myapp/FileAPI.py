import os
import uuid
import shutil
from pyramid.response import Response
from pyramid.view import view_config

@view_config(route_name='uploadFile', renderer='json')
def store_mp3_view(request):
    # ``filename`` contains the name of the file in string format.
    #
    # WARNING: this example does not deal with the fact that IE sends an
    # absolute file *path* as the filename.  This example is naive; it
    # trusts user input.
    print(request.POST)
    path = {}
    for key in request.POST:
        filename = request.POST['0'].filename
        print(filename)
        fileExtension = filename.split('.')
        print(fileExtension)
        fileExtension = fileExtension[-1]
        # ``input_file`` contains the actual file data which needs to be
        # stored somewhere.

        input_file = request.POST[key].file

        # Note that we are generating our own filename instead of trusting
        # the incoming filename since that might result in insecure paths.
        # Please note that in a real application you would not use /tmp,
        # and if you write to an untrusted location you will need to do
        # some extra work to prevent symlink attacks.

        here = os.path.abspath(os.path.dirname(__file__))

        rel_path = '/static/images/' + '%s.%s' % (uuid.uuid4(), fileExtension)

        file_path = here + rel_path

        print(file_path)
        print(rel_path)

        # We first write to a temporary file to prevent incomplete files from
        # being used.

        temp_file_path = file_path + '~'

        print(temp_file_path)

        # Finally write the data to a temporary file
        input_file.seek(0)
        with open(temp_file_path, 'w+b') as output_file:
            shutil.copyfileobj(input_file, output_file)

        # Now that we know the file has been fully saved to disk move it into place.

        os.rename(temp_file_path, file_path)
        path[key] = rel_path

    return path
