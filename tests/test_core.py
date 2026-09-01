import pytest
import os

def test_manifests():
    assert os.path.exists('README.md')
    assert os.path.exists('AGENTS.md')
    assert os.path.exists('PROJECT_STATUS.md')
    assert os.path.exists('index.html')
