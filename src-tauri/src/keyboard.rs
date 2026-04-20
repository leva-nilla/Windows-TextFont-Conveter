use std::mem;
use std::time::Duration;
use winapi::ctypes::c_int;
use winapi::um::winuser::{
    SendInput, INPUT, INPUT_KEYBOARD, KEYEVENTF_KEYUP, VK_CONTROL, VK_MENU, VK_SHIFT,
};

const VK_C: u16 = 0x43;
const VK_V: u16 = 0x56;

/// Release any held modifier keys to prevent interference with simulated keypresses.
/// When the user presses Ctrl+Shift+F, those modifiers are still physically held.
/// We must release them before simulating Ctrl+C to avoid sending Ctrl+Shift+C.
pub fn release_modifiers() {
    let inputs = [
        make_key_input(VK_CONTROL as u16, true),
        make_key_input(VK_SHIFT as u16, true),
        make_key_input(VK_MENU as u16, true),
    ];
    unsafe {
        SendInput(
            inputs.len() as u32,
            inputs.as_ptr() as *mut INPUT,
            mem::size_of::<INPUT>() as c_int,
        );
    }
}

/// Simulate Ctrl+C key press to copy selected text.
pub fn simulate_copy() {
    release_modifiers();
    std::thread::sleep(Duration::from_millis(50));
    send_key_combo(VK_CONTROL as u16, VK_C);
}

/// Simulate Ctrl+V key press to paste clipboard content.
pub fn simulate_paste() {
    release_modifiers();
    std::thread::sleep(Duration::from_millis(50));
    send_key_combo(VK_CONTROL as u16, VK_V);
}

fn send_key_combo(modifier: u16, key: u16) {
    let inputs = [
        make_key_input(modifier, false), // modifier down
        make_key_input(key, false),       // key down
        make_key_input(key, true),        // key up
        make_key_input(modifier, true),   // modifier up
    ];
    unsafe {
        SendInput(
            inputs.len() as u32,
            inputs.as_ptr() as *mut INPUT,
            mem::size_of::<INPUT>() as c_int,
        );
    }
}

fn make_key_input(vk: u16, key_up: bool) -> INPUT {
    let mut input: INPUT = unsafe { mem::zeroed() };
    input.type_ = INPUT_KEYBOARD;
    unsafe {
        let ki = input.u.ki_mut();
        ki.wVk = vk;
        ki.wScan = 0;
        ki.dwFlags = if key_up { KEYEVENTF_KEYUP } else { 0 };
        ki.time = 0;
        ki.dwExtraInfo = 0;
    }
    input
}
